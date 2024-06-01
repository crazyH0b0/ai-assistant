import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

const Layout =async ({children}:{children: React.ReactNode}) => {
  const user =await currentUser()

  if(user) redirect("/")
  return (
    <div className='h-screen flex w-full justify-center  '>
      <div className="w-[600px]   
      flex flex-col items-start p-6">
        <Image src={'/images/logo.png'} alt='LOGO'
        style={{
          width: "20%",
        }}
       sizes='30'
       width={600} 
       height={600} 
          />
        {children}
      </div>
      <div className='hidden lg:flex flex-1 w-full max-h-full 
      overflow-hidden    flex-col pt-10 pl-24 gap-3
      '>
          <h2 className="text-gravel md:text-4xl font-bold">
          Hi,我是你的 AI 销售助理!
        </h2>
        <p className="text-iridium md:text-sm mb-10">
        我能够在无需表单的情况下捕捉潜在客户信息...{' '}
          <br />
          something never done before 😉
        </p>
        <Image
          src="/images/app-ui.png"
          alt="app image"
          loading="lazy"
          sizes="30"
          className="!w-[800px] "
          width={20}
          height={20}
        />
      </div>
    </div>
  )
}

export default Layout