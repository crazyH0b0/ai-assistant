'use server';

import { prisma } from '@/server/db/client';

export async function onGetChatMessages(id: string) {
  try {
    const messages = await prisma.chatRoom.findMany({
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
