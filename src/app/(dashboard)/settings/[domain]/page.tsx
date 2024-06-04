import { onGetCurrentDomain } from '@/actions/settings'
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
  params: {domain: string}
}

const DomainSettingPage =async ({params}: Props) => {
  const domain = await onGetCurrentDomain(params.domain) 
  if(!domain ) return redirect("/dashboard")
  return (
    <div>
      
    </div>
  )
}

export default DomainSettingPage
