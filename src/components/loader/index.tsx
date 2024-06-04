import React from 'react'
import { Spinner } from '../spinner'
import { cn } from '@/lib/utils'

interface LoaderProps {
  children: React.ReactNode
  loading: boolean
  className?: string,
  noPadding?:boolean
}

const Loader = ({children, loading, className,noPadding}: LoaderProps) => {
  return loading ? (
    <div className={cn(className ||'w-full py-5 flex justify-between'
     )}>
      <Spinner noPadding={noPadding} />
    </div>
  )
  : children
    
}

export default Loader