"use client"
import UseSidebar from '@/hooks/use-sidebar'
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
  const {expand, onExpend, page, onSignOut} = UseSidebar()
  return (
    <div>
      sidebar
      
    </div>
  )
}

export default Sidebar
