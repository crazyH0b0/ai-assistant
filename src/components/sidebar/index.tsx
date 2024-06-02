"use client"
import useSidebar from '@/hooks/use-sidebar'
import React from 'react'

interface Props {
  domains: {
    
      id: string
      name: string
      icon: string
    
  }[]
  | null | undefined
  
}

const Sidebar = ({domains}: Props) => {
  const {expand, onExpand, page, onSignOut} = useSidebar()
  return (
    <div>
      sidebar
      
    </div>
  )
}

export default Sidebar
