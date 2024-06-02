import React from 'react'

interface Props {
  label: string
  message: string
  
}

const Section = ({label, message}: Props) => {
  return (
    <div>
      <p className='text-sm font-medium'>{label}</p>
      <p className='text-sm font-medium'>{message}</p>
      
    </div>
  )
}

export default Section
