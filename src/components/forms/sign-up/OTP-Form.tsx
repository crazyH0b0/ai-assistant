"use client"

import OTPInput from '@/components/otp'
import React from 'react'

interface Props {
  setOTP: React.Dispatch<React.SetStateAction<string>>
  otp: string

  
}

const OTPForm = ({setOTP, otp}: Props) => {
  return (
    <>
      <h2 className='text-gravel md:text-4xl font-bold'>输入 OTP</h2>
      <p className='text-iridium md:text-sm'>请输入邮箱中的 6 位代码</p>
      <div className='w-full justify-center flex py-5'>
        <OTPInput setOTP={setOTP} otp={otp} />
      </div>
    </>
  )
}

export default OTPForm
