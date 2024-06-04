"use server"
import { prisma } from "@/server/db/client"
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"

// 获取域名
export async function onGetCurrentDomain(domain:string) {
  const user = await currentUser()
  if(!user) return auth().redirectToSignIn()
  try {
    const userDomain = await prisma.user.findUnique({
      where: {
        clerkId: user.id
      },
      select: {
        domains: {
          where: {
            name: {
              contains:domain
            }
          },
          select: {
            id: true,
            name: true,
            icon: true,
            userId: true,
            chatBot: {
              select: {
                id: true,
                welcomeMessage: true,
                icon: true
              }
              
            }
          }
        },
        subscription: {
          select: {
            plan: true
          }
        },
        
      }
    })
    if(userDomain) return userDomain
  } catch (error) {
    console.log(error);
    
  }
  
}

// 修改密码
export async function onUpdatePassword(password: string) {
  try {
    const user = await currentUser()
  if(!user) return auth().redirectToSignIn()
  const update = await clerkClient.users.updateUser(user.id, {password})
  if(update) return {status: 200, message: '密码更新成功~'}
  } catch (error) {
    console.log(error);
    
  }
}

// 添加域名
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

// 获取用户的域名
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