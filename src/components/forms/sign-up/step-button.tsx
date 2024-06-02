"use client"

import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/context/use-auth-context'
import { useSignUpForm } from '@/hooks/sign-up/use-sign-up'
import Link from 'next/link'
import React from 'react'
import { useFormContext } from 'react-hook-form'

interface Props {
  
}

const StepButton = (props: Props) => {
  const {currentStep, setCurrentStep} = useAuthContext()
  const {formState, getFieldState, getValues} = useFormContext()
  const {onGenerateOTP} = useSignUpForm()

  // 用于判断 form 中的字段是否已经填写
  const {isDirty: isName} = getFieldState("fullname", formState)
  const {isDirty: isEmail} = getFieldState("email", formState)
  const {isDirty: isPassword} = getFieldState("password", formState)
  

  if(currentStep === 2) {
    return (
      <div className='w-full flex flex-col gap-3 items-center'>
        <Button 
        type='submit' 
        className='w-full'
        {
          ...(isName  && isEmail && isPassword && {
            onClick: () => onGenerateOTP(
              getValues('email'),
              getValues('password'),
              setCurrentStep,
            )
          })
        }
        >下一步</Button>
        <p>已经拥有账号？{' '}
        <Link href={'/auth/sign-in'} className='font-bold underline'>登录</Link>
        </p>
      </div>
    )
  }

  if(currentStep === 3) {
    return (
      <div className='w-full flex flex-col gap-3 items-center'>
        <Button 
        type='submit' 
        className='w-full'
        >创建账号</Button>
        <p>已经拥有账号？{' '}
        <Link href={'/auth/sign-in'} className='font-bold underline'>登录</Link>
        </p>
      </div>
    )
  }
  
  return (
    <div className='w-full flex flex-col gap-3 items-center'>
    <Button 
    type='submit' 
    className='w-full'
    onClick={() => setCurrentStep((prev) => prev + 1)}
    >继续</Button>
    <p>已经拥有账号？{' '}
    <Link href={'/auth/sign-in'} className='font-bold underline'>登录</Link>
    </p>
  </div>
  )
}

export default StepButton
