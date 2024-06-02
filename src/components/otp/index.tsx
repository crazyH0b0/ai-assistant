"use client"

import React, { SetStateAction } from 'react'
import {
  InputOTP,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface Props {
  otp: string;
  setOTP: React.Dispatch<SetStateAction<string>>
  
}

const OTPInput = ({otp, setOTP}: Props) => {
  return (
    <InputOTP maxLength={6} value={otp} onChange={(otp) => setOTP(otp)}>
      <div className='flex gap-3'>
        <div>
          <InputOTPSlot index={0}></InputOTPSlot>
        </div>

        <div>
          <InputOTPSlot index={1}></InputOTPSlot>
        </div>

        <div>
          <InputOTPSlot index={2}></InputOTPSlot>
        </div>

        <div>
          <InputOTPSlot index={3}></InputOTPSlot>
        </div>

        <div>
          <InputOTPSlot index={4}></InputOTPSlot>
        </div>

        <div>
          <InputOTPSlot index={5}></InputOTPSlot>
        </div>
      </div>
  </InputOTP>
  )
}

export default OTPInput
