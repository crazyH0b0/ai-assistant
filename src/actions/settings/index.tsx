"use server"
import { prisma } from "@/server/db/client"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function handleAddDomainAction(doamin:string, icon:string) {
  const user = await currentUser()
  if(!user) return auth().redirectToSignIn()
  try {
    const subscription = await prisma.user.findUnique({
      where: {
        clerkId: user.id
      },
      select: {
        _count: {
          select: {
            domains: true
          }
        },
        subscription: {
          select: {
            plan: true
          }
        }
      }
    })
    const domainExists = await prisma.user.findFirst({
      where: {
        clerkId: user.id,
        domains: {
          some: {
            name: doamin
          }
        }
      }
    })
    if(!domainExists) {
      if(
        (subscription?.subscription?.plan == 'STANDARD' &&
          subscription._count.domains < 1) ||
        (subscription?.subscription?.plan == 'PRO' &&
          subscription._count.domains < 5) ||
        (subscription?.subscription?.plan == 'ULTIMATE' &&
          subscription._count.domains < 10)
      ) {
        const newDomain = await prisma.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            domains: {
              create: {
                name: doamin,
                icon,
                chatBot: {
                  create: {
                    welcomeMessage: 'Hey there, have a question? Text us here.'
                  }
                }
              }
            }
          }
        })
        if(newDomain) {
          return {status: 200, message: '域名添加成功'}
        }
        return {
          status: 400,
          message: '可添加域名超出上限，请升级订阅~'
        }
      }
    }
   return {
    status: 400,
    message: '域名已存在'
   }
  } catch (error) {
    console.log(error);
    
  }
  
}

export const onGetAllAccountDomains = async () => {
  const user = await currentUser()
  if(!user) return auth().redirectToSignIn()
  
    try {
      const domains = await prisma.user.findUnique({
        where: {
          clerkId: user.id
        },
        select: {
          id: true,
          domains: {
            select: {
              name: true,
              icon: true,
              id: true,
              customer: {
                select: {
                  chatRoom: {
                    select: {
                      id: true,
                      live: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      return domains
    } catch (error) {
      console.log(error);
      
      
    }

}