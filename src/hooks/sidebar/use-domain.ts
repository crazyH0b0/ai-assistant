"use client"
import { useToast } from '@/components/ui/use-toast';
import { AddDomainSchema, DomainSettingsProps } from './../../schemas/settings.schema';
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from 'next/navigation';
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import React from 'react';
import { handleAddDomainAction } from '@/actions/settings';

export default   function useDomain() {
  const {register ,handleSubmit, formState:{errors}, reset} = useForm<z.infer<typeof AddDomainSchema>>({
    resolver: zodResolver(AddDomainSchema),
  }
  )
  const pathname = usePathname()
  const {toast} = useToast()
  const [loading, setLoading] = React.useState(false)
  const [isDomain, setIsDomain] = React.useState<string | undefined>(undefined)
  const router = useRouter()

  React.useEffect(() => {
    setIsDomain(pathname.split('/').pop())
  }, [pathname])

  const onAddDomain = handleSubmit(async (values) => {    
    setLoading(true)
    // 替换 IMAGE 的地址
    const domain =  await handleAddDomainAction(values.domain, 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aWNvbnxlbnwwfHwwfHx8MA%3D%3D')
    if(domain) {
      reset()
      setLoading(false)
      toast({
        title: domain.status === 200 ? '成功' : '失败',
        description: domain.message
      })
      router.refresh()
    }

  })
  
  return {
    register,
    onAddDomain,
    errors,
    loading,
    isDomain
  }
}