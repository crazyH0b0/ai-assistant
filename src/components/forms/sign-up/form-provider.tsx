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