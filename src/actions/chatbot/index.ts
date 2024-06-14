'use server';

import { extractEmailsFromString, extractURLfromString } from '@/lib/utils';
import { onRealTimeChat } from '../conversation';
import OpenAi from 'openai';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/server/db/client';
import { onMailer } from '../mail';

const openai = new OpenAi({
  apiKey: process.env.OPEN_AI_KEY,
  baseURL: process.env.OPEN_AI_BASE_URL,
});

// 在指定的聊天房间中插入新的聊天消息。通过 update 操作向现有的 chatRoom 记录中 create 新的 message
export const onStoreConversations = async (id: string, message: string, role: 'assistant' | 'user') => {
  await prisma.chatRoom.update({
    where: {
      id,
    },
    data: {
      message: {
        create: {
          message,
          role,
        },
      },
    },
  });
};

export const onGetCurrentChatBot = async (id: string) => {
  try {
    const chatbot = await prisma.domain.findUnique({
      where: {
        id,
      },
      select: {
        helpdesk: true,
        name: true,
        chatBot: {
          select: {
            id: true,
            welcomeMessage: true,
            icon: true,
            textColor: true,
            background: true,
            helpdesk: true,
          },
        },
      },
    });

    if (chatbot) {
      return chatbot;
    }
  } catch (error) {
    console.log(error);
  }
};

let customerEmail: string | undefined;

export const onAiChatBotAssistant = async (
  id: string,
  chat: { role: 'assistant' | 'user'; content: string }[],
  author: 'user',
  message: string
) => {
  try {
    const chatBotDomain = await prisma.domain.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        filterQuestions: {
          where: {
            answered: null,
          },
          select: {
            question: true,
          },
        },
      },
    });
    if (chatBotDomain) {
      const extractedEmail = extractEmailsFromString(message);
      // 检查用户发送的内容有包含邮箱
      if (extractedEmail) {
        customerEmail = extractedEmail[0];
      }
      console.log({ chat }, { customerEmail });

      // 用户发送的内容有包含邮箱
      if (customerEmail) {
        // 查找数据库中是否有与该 customer 发送的邮箱匹配的条目
        const checkCustomer = await prisma.domain.findUnique({
          where: {
            id,
          },
          select: {
            User: {
              select: {
                clerkId: true,
              },
            },
            name: true,
            customer: {
              where: {
                email: {
                  startsWith: customerEmail,
                },
              },
              select: {
                id: true,
                email: true,
                questions: true,
                chatRoom: {
                  select: {
                    id: true,
                    live: true,
                    mailed: true,
                  },
                },
              },
            },
          },
        });

        // 如果找到了客户，并且客户列表为空，表示这是新客户
        // 因为checkCustomer.customer返回的是一个客户对象数组，
        // 如果数组长度为0，则表示没有找到与该邮件地址匹配的现有客户
        if (checkCustomer && !checkCustomer.customer.length) {
          const newCustomer = await prisma.domain.update({
            where: {
              id,
            },
            data: {
              customer: {
                create: {
                  email: customerEmail,
                  questions: {
                    create: chatBotDomain.filterQuestions,
                  },
                  chatRoom: {
                    create: {},
                  },
                },
              },
            },
          });

          // 创建 customer 成功
          if (newCustomer) {
            console.log('new customer made');
            const response = {
              role: 'assistant',
              content: `Welcome aboard ${
                customerEmail.split('@')[0]
              }! I'm glad to connect with you. Is there anything you need help with?`,
            };
            return { response };
          }
        }

        // chatroom 状态为 live，不需要 AI 接管，则直接通过 pusher 进行 socket 通信
        if (checkCustomer && checkCustomer.customer[0].chatRoom[0].live) {
          await onStoreConversations(checkCustomer?.customer[0].chatRoom[0].id!, message, author);

          onRealTimeChat(checkCustomer.customer[0].chatRoom[0].id, message, 'user', author);

          // 该 customer 所属的 chatroom 还没有被发送过邮件
          if (!checkCustomer.customer[0].chatRoom[0].mailed) {
            const user = await clerkClient.users.getUser(checkCustomer.User?.clerkId!);

            onMailer(user.emailAddresses[0].emailAddress);

            //确保每个聊天室只能发送一次邮件，防止恶意 spam
            const mailed = await prisma.chatRoom.update({
              where: {
                id: checkCustomer.customer[0].chatRoom[0].id,
              },
              data: {
                mailed: true,
              },
            });

            if (mailed) {
              return {
                live: true,
                chatRoom: checkCustomer.customer[0].chatRoom[0].id,
              };
            }
          }
          return {
            live: true,
            chatRoom: checkCustomer.customer[0].chatRoom[0].id,
          };
        }

        //  AI 接管
        await onStoreConversations(checkCustomer?.customer[0].chatRoom[0].id!, message, author);

        // 如果响应中包含 (realtime) 关键字，
        // 则将聊天房间状态更新为实时模式，以便用户能够与人工客服进行实时对话。
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: 'assistant',
              content: `
              你将会收到一系列需要问客户的问题。 
              
              使用这些问题来推进对话。 
              
              每当你问一个来自问题数组中的问题时，请在问题的末尾添加一个关键词 (complete)，这个关键词非常重要。
              
              请不要忘记这个关键词。


              仅在你提出的问题来自问题数组时添加这个关键词。其他问题不符合这个条件。

              始终保持角色并保持尊重。

              问题数组： [${chatBotDomain.filterQuestions.map((questions) => questions.question).join(', ')}]

              如果客户说了一些无关或不适当的话，请简单地告诉他们这超出了你的能力范围，你会让一个真人用户继续对话。在这句话的末尾添加关键词 (realtime)。

              如果客户同意预约，请发送给他们这个链接： http://localhost:3000/portal/${id}/appointment/${
                checkCustomer?.customer[0].id
              }
              }
          `,
            },
            ...chat,
            {
              role: 'user',
              content: message,
            },
          ],
          model: 'gpt-3.5-turbo',
        });

        // 检测到 AI 生成的聊天消息中包含 (realtime) 标记时，将聊天模式切换到实时模式
        if (chatCompletion.choices[0].message.content?.includes('(realtime)')) {
          const realtime = await prisma.chatRoom.update({
            where: {
              id: checkCustomer?.customer[0].chatRoom[0].id,
            },
            data: {
              live: true,
            },
          });

          // 移除消息内容中的 (realtime) 标记
          // 当 AI 生成的响应包含 (realtime) 标记时，
          // 表示需要将聊天模式切换到实时模式。这个标记仅用于内部逻辑处理，并不应该显示给用户。
          // 因此，需要在将响应内容发送给用户之前，将这个标记移除。
          if (realtime) {
            const response = {
              role: 'assistant',
              content: chatCompletion.choices[0].message.content.replace('(realtime)', ''),
            };

            await onStoreConversations(checkCustomer?.customer[0].chatRoom[0].id!, response.content, 'assistant');

            return { response };
          }
        }

        // 检测到聊天内容中包含 (complete) 标记时，更新客户回答的状态
        if (chat[chat.length - 1].content.includes('(complete)')) {
          const firstUnansweredQuestion = await prisma.customerResponses.findFirst({
            where: {
              customerId: checkCustomer?.customer[0].id,
              answered: null,
            },
            select: {
              id: true,
            },
            orderBy: {
              question: 'asc',
            },
          });
          if (firstUnansweredQuestion) {
            await prisma.customerResponses.update({
              where: {
                id: firstUnansweredQuestion.id,
              },
              data: {
                answered: message,
              },
            });
          }
        }

        // 处理聊天完成后生成的回复的逻辑。它检查聊天回复中是否包含 URL 链接
        if (chatCompletion) {
          const generatedLink = extractURLfromString(chatCompletion.choices[0].message.content as string);

          if (generatedLink) {
            const link = generatedLink[0];
            const response = {
              role: 'assistant',
              content: `Great! you can follow the link to proceed`,
              link: link.slice(0, -1),
            };

            await onStoreConversations(
              checkCustomer?.customer[0].chatRoom[0].id!,
              `${response.content} ${response.link}`,
              'assistant'
            );

            return { response };
          }

          const response = {
            role: 'assistant',
            content: chatCompletion.choices[0].message.content,
          };

          await onStoreConversations(checkCustomer?.customer[0].chatRoom[0].id!, `${response.content}`, 'assistant');

          return { response };
        }
      }

      // 没有找到客户信息的情况（即客户匿名的情况）
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content: `
            You are a highly knowledgeable and experienced sales representative for a ${chatBotDomain.name} that offers a valuable product or service. Your goal is to have a natural, human-like conversation with the customer in order to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or redirect them to a link if they havent provided all relevant information.
            Right now you are talking to a customer for the first time. Start by giving them a warm welcome on behalf of ${chatBotDomain.name} and make them feel welcomed.

            Your next task is lead the conversation naturally to get the customers email address. Be respectful and never break character

          `,
          },
          ...chat,
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'gpt-3.5-turbo',
      });

      if (chatCompletion) {
        const response = {
          role: 'assistant',
          content: chatCompletion.choices[0].message.content,
          live: false,
        };

        return { response };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
