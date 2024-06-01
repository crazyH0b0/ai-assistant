import React from 'react'
import { Spinner } from '../spinner'

interface LoaderProps {
  children: React.ReactNode
  loading: boolean
}

const Loader = ({children, loading}: LoaderProps) => {
  return loading ? (
    <div className='w-full py-5 flex justify-between'>
      <Spinner />
    </div>
  )
  : children
    
}

export default Loader