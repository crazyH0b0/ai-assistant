import { prisma } from '@/server/db/client'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import Section from '../section-label'

interface Props {
  
}

const BillingSetting =async (props: Props) => {
  let plan = null

  try {
    const user = await currentUser()
    
    if(!user) return
    
    const dbPlan = await prisma.user.findUnique({
      where: {
        clerkId: user.id
      },
      select: {
        subscription: {
          select: {
            plan: true
          }
        }
      }
    })

    if(dbPlan) {
      plan = dbPlan.subscription?.plan
    }
    
  } catch (error) {
    
  }
  return (
    <div className='grid grid-cols-1 lg:grid-cols-5 gap-10'>
      <div className='lg:col-span-1'>
        <Section label="账单设置" message="添加账号信息，升级或者修改订阅" />
      </div>
      
    </div>
  )
}

export default BillingSetting
