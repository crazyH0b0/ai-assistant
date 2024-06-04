"use client"

import Loader from '@/components/loader'
import { AuthContextProvider } from '@/context/use-auth-context'
import { useSignUpForm } from '@/hooks/sign-up/use-sign-up'
import React from 'react'
import { FormProvider } from 'react-hook-form'

const SignUpFormProvider = ({children}:{children: React.ReactNode}) => {
  const {form, onHandleSubmit, loading} = useSignUpForm()
  return (
    <AuthContextProvider>
       {/* 需要用到 form 状态的组件太多，所以考虑使用了 provider 的方式，避免 prop drilling */}
      <FormProvider {...form}>
        <form onSubmit={onHandleSubmit}>
          <div className='flex flex-col justify-between gap-3 h-full'>
            <Loader loading={loading}  >{children}</Loader>
          </div>
        </form>
      </FormProvider>
    </AuthContextProvider>
  )
}

export default SignUpFormProvider