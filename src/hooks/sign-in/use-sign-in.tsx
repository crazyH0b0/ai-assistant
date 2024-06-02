"use client"

import { UserLoginProps, UserLoginSchema, UserRegistrationProps, UserRegistrationSchema } from './../../schemas/auth.schema';
import { useToast } from "@/components/ui/use-toast"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { z } from "zod"

export const useSigninForm = () => {
  const [loading, setLoading] = React.useState(false)

  const {toast} = useToast()
  
  const {signIn, isLoaded, setActive} = useSignIn()

  const router = useRouter()

  const form  = useForm<z.infer<typeof UserLoginSchema>>({
    resolver: zodResolver(UserLoginSchema),
    mode: 'onChange'
  })


  // 表单提交处理函数
  const onHandleSubmit = form.handleSubmit(
    async (data: UserLoginProps) => {
      const {email, password} = data

      if(!isLoaded) return

       try {

        setLoading(true)
        
        const authenticated = await signIn.create({identifier:email, password})
        if(authenticated.status !== 'complete') return {message: '出错了~'}

        if(authenticated.status === 'complete') {

        await setActive({session: authenticated.createdSessionId})
        toast({
          title: '登录成功',
          description: '欢迎回来~',

        })
        router.push("/dashboard")


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
    loading
  }
}