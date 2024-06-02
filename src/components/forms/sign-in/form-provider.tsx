"use client"

import Loader from '@/components/loader'
import { useSigninForm } from '@/hooks/sign-in/use-sign-in'
import React from 'react'
import { FormProvider } from 'react-hook-form'

interface Props {
  children: React.ReactNode
}

const SignInFormProvider = ({children}: Props) => {
  const {form ,onHandleSubmit, loading} = useSigninForm()
  return (
      <FormProvider {...form}>
        <form onSubmit={onHandleSubmit} className='h-full'>
          <div className='flex flex-col justify-between gap-3 h-full'>
            <Loader loading={loading}>{children}</Loader>
          </div>
        </form>
      </FormProvider>
  )
}

export default SignInFormProvider
