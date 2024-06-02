"use server"
import { prisma } from "@/server/db/client"
import { auth, currentUser } from "@clerk/nextjs/server"

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