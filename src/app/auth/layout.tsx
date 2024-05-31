import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Layout =async ({children}:{children: React.ReactNode}) => {
  const user =await currentUser()

  if(user) redirect("/")
  return (
    <div>{children}</div>
  )
}

export default Layout