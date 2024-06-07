'use server';

import { pusherServer } from '@/lib/utils';
import { prisma } from '@/server/db/client';

export const onRealTimeChat = async (chatroomId: string, message: string, id: string, role: 'assistant' | 'user') => {
  pusherServer.trigger(chatroomId, 'realtime-mode', {
    chat: {
      message,
      id,
      role,
    },
  });
};

export async function onOwnerSendMessage(chatroom: string, message: string, role: 'assistant' | 'user') {
  try {
    const chat = await prisma.chatRoom.update({
      where: { id: chatroom },
      data: {
        message: {
          create: {
            message,
            role,
          },
        },
      },
      select: {
        message: {
          select: {
            id: true,
            role: true,
            message: true,
            createdAt: true,
            seen: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (chat) return chat;
  } catch (error) {
    console.log(error);
  }
}

export async function onViewUnReadMessages(id: string) {
  try {
    await prisma.chatMessage.updateMany({
      where: { id },
      data: {
        seen: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// 从数据库中获取聊天消息
export async function onGetChatMessages(id: string) {
  try {
    // TODO: 验证是使用 findUnique 还是 findMany
    const messages = await prisma.chatRoom.findUnique({
      where: { id },
      select: {
        id: true,
        live: true,
        message: {
          select: {
            id: true,
            role: true,
            message: true,
            createdAt: true,
            seen: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (messages) return messages;
  } catch (error) {
    console.log(error);
  }
}

// 根据域名 id 获取全部的聊天室
export async function onGetDomainChatRooms(id: string) {
  try {
    const domains = await prisma.domain.findUnique({
      where: { id },
      select: {
        customer: {
          select: {
            email: true,
            chatRoom: {
              select: {
                createdAt: true,
                id: true,
                message: {
                  select: {
                    message: true,
                    createdAt: true,
                    seen: true,
                  },
                  orderBy: {
                    createdAt: 'desc',
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (domains) {
      return domains;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function onToggleRealtime(id: string, state: boolean) {
  try {
    const chatRoom = await prisma.chatRoom.update({
      where: {
        id,
      },
      data: {
        live: state,
      },
      select: {
        id: true,
        live: true,
      },
    });

    if (chatRoom) {
      return {
        status: 200,
        message: chatRoom.live ? '实时开启' : '实时关闭',
        chatRoom,
      };
    }
  } catch (error) {}
}

export async function onGetConversationMode(id: string) {
  try {
    const mode = await prisma.chatRoom.findUnique({
      where: {
        id,
      },
      select: {
        live: true,
      },
    });

    console.log({ mode });

    return mode;
  } catch (error) {
    console.log(error);
  }
}
