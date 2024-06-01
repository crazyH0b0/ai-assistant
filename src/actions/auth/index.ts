"use server"
import { prisma } from "@/server/db/client"

export const onComplateUserRegistration = async(
  fullname: string,
  clerkId: string,
  type: string,
) => {
  try {
    const registered = await prisma.user.create({
      data: {
        fullname,
        clerkId,
        type,
        subscription: {
          create: {}
        }
      },
      select: {
        fullname: true,
        id: true,
        type: true
      }
    })

    if(registered) return {status: 200, user: registered}

  } catch (error) {
    return {status: 400}
  }
}