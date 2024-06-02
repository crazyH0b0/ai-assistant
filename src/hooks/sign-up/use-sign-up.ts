"use client"

import { UserRegistrationProps, UserRegistrationSchema } from './../../schemas/auth.schema';
import { useToast } from "@/components/ui/use-toast"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { z } from "zod"
import { onComplateUserRegistration } from '@/actions/auth';

export const useSignUpForm = () => {
  const [loading, setLoading] = React.useState(false)

  const {toast} = useToast()
  
  const {signUp, isLoaded, setActive} = useSignUp()

  const router = useRouter()

  const form  = useForm<z.infer<typeof UserRegistrationSchema>>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      type: "owner",
    },
    mode: 'onChange'
  })

  const onGenerateOTP = async (
    email: string,
    password: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {

    if(!isLoaded) return

    try {

      // 创建注册
      await signUp.create({
        emailAddress: email,
        password: password
      })

      // 发送邮箱验证码
      await signUp.prepareEmailAddressVerification({strategy: 'email_code'})
      
      // 进入下一步
      onNext((prev) => prev +1 )

    } catch (error: any) {

      toast({
        title: 'Error',
        description: error.errors[0].longMessage
      })
      
    }

  }

  // 表单提交处理函数
  const onHandleSubmit = form.handleSubmit(
    async (data: UserRegistrationProps) => {
      const {type, fullname, otp} = data

      if(!isLoaded) return

       try {

        setLoading(true)
        
        // 尝试邮箱验证码验证
        const complateSignup = await signUp.attemptEmailAddressVerification({
          code: otp
        })
        if(complateSignup.status !== 'complete') return {message: '出错了~'}

        if(complateSignup.status === 'complete') {
          
          if(!signUp.createdUserId) return

          const registered = await onComplateUserRegistration(
            fullname,
            signUp.createdUserId,
            type
          )

          if(registered?.status === 200 && registered.user) {
            await setActive({
              session: complateSignup.createdSessionId
            })
            setLoading(false)
            router.push("/dashboard")
          }

          if(registered?.status === 400) {
           toast({
            title: 'Error',
            description: ' 出错了~'
           }) 
          }
        }
       } catch (error: any) {
        toast({
          title: 'Error',
          description: error.errors[0].longMessage
        })
        
       }

    }
  )

  return {
    form,
    onHandleSubmit,
    onGenerateOTP,
    loading
  }
}