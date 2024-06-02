"use server"

import { prisma } from "@/server/db/client"

export async function onToggleRealtime (id: string, state: boolean) {
  try {
    const chatRoom = await prisma.chatRoom.update({
      where: {
        id
      },
      data: {
        live: state
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

export async function onGetConversationMode(id:string) {
  try {
    const mode = await prisma.chatRoom.findUnique({
      where: {
        id
      },
      select: {
        live: true
      }
    })

    console.log({mode});
    
    return mode

  } catch (error) {
    console.log(error);
    
  }
  
}