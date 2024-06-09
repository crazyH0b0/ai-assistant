'use server';

import { extractEmailsFromString, extractURLfromString } from '@/lib/utils';
import { onRealTimeChat } from '../conversation';
import OpenAi from 'openai';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/server/db/client';
import { onMailer } from '../mail';

const openai = new OpenAi({
  apiKey: process.env.OPEN_AI_KEY,
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
        if (checkCustomer && checkCustomer.customer[0].chatRoom[0].live) {
          await onStoreConversations(checkCustomer?.customer[0].chatRoom[0].id!, message, author);

          // onRealTimeChat(checkCustomer.customer[0].chatRoom[0].id,
          //    message, 'user', author);

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

        await onStoreConversations(checkCustomer?.customer[0].chatRoom[0].id!, message, author);

        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: 'assistant',
              content: `
              You will get an array of questions that you must ask the customer. 
              
              Progress the conversation using those questions. 
              
              Whenever you ask a question from the array i need you to add a keyword at the end of the question (complete) this keyword is extremely important. 
              
              Do not forget it.

              only add this keyword when your asking a question from the array of questions. No other question satisfies this condition

              Always maintain character and stay respectfull.

              The array of questions : [${chatBotDomain.filterQuestions
                .map((questions) => questions.question)
                .join(', ')}]

              if the customer says something out of context or inapporpriate. Simply say this is beyond you and you will get a real user to continue the conversation. And add a keyword (realtime) at the end.

              if the customer agrees to book an appointment send them this link http://localhost:3000/portal/${id}/appointment/${
                checkCustomer?.customer[0].id
              }

              if the customer wants to buy a product redirect them to the payment page http://localhost:3000/portal/${id}/payment/${
                checkCustomer?.customer[0].id
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

        if (chatCompletion.choices[0].message.content?.includes('(realtime)')) {
          const realtime = await prisma.chatRoom.update({
            where: {
              id: checkCustomer?.customer[0].chatRoom[0].id,
            },
            data: {
              live: true,
            },
          });

          if (realtime) {
            const response = {
              role: 'assistant',
              content: chatCompletion.choices[0].message.content.replace('(realtime)', ''),
            };

            await onStoreConversations(checkCustomer?.customer[0].chatRoom[0].id!, response.content, 'assistant');

            return { response };
          }
        }
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
      console.log('No customer');
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
        };

        return { response };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
