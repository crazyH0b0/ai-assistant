import { AuthContextProvider } from '@/context/use-auth-context'
import React from 'react'
import { FormProvider } from 'react-hook-form'

const SignUpFormProvider = ({children}:{children: React.ReactNode}) => {
  return (
    <AuthContextProvider>
      1
      {/* <FormProvider></FormProvider> */}
    </AuthContextProvider>
  )
}

export default SignUpFormProvider