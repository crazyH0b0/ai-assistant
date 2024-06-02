"use server"

import { prisma } from "@/server/db/client"

export async function onToggleRealtime (id: string, state: boolean) {
  try {
    const chatRoom = await prisma.chatRoom.update({
      where: {
        id
      },
      data: {
        live: true
      },
      select: {
        id: true,
        live: true
      }
    })

    if(chatRoom) {
      return {
        status: 200,
        message: chatRoom.live ? '实时开启' : '实时关闭',
        chatRoom
      }
    }
    
  } catch (error) {
    
  }

}