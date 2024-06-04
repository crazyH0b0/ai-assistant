"use client"
import { onUpdatePassword } from "@/actions/settings"
import { useToast } from "@/components/ui/use-toast"
import { ChangePasswordSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export function useThemeMode() {
  const { setTheme, theme } = useTheme()
  return {
    setTheme,
    theme,
  }  
}

export function useChangePassword() {
  const [loading, setLoading] = React.useState(false)
  
  const {handleSubmit, reset, register, formState:{errors}} = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'onChange'
  })
  const {toast} = useToast()
  const onChangePassword =  handleSubmit(async(values) => {
    try {
      setLoading(true)
      const updated = await onUpdatePassword(values.password)
      if(updated) {
        reset()
        setLoading(false)
        toast({
          title: '成功',
          description: updated.message
        })
      }
    } catch (error) {
      console.log(error);
      
    }

  })
  return {
    register,
    onChangePassword,
    loading,
    errors
  }
}
