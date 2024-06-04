"use client"
import useSidebar from '@/hooks/sidebar/use-sidebar'
import { cn } from '@/lib/utils'
import React from 'react'
import ExpandMenu from './expand-menu'
import UnexpandMenu from './unexpand-menu'

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
    <div className={cn('bg-cream h-full w-[60px] fill-mode-forwards fixed md:relative',
      expand === undefined && '',
      expand === true ? 'animate-open-sidebar' : 'animate-close-sidebar'
    )}>
      {
        expand ? (
        <ExpandMenu
        domains={domains}
        current={page!}
        onExpand={onExpand}
        onSignOut={onSignOut}
        />       
        ) : (
          <UnexpandMenu
          domains={domains}
          current={page!}
          onShrink={onExpand}
          onSignOut={onSignOut}
          />
        )
      }
      
    </div>
  )
}

export default Sidebar
