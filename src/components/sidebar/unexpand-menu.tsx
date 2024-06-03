import React from 'react'

interface Props {
  onExpand: () => void
  current: string
  onSignOut():  void
  domains: {
    
    id: string
    name: string
    icon: string
  
}[]
| null | undefined

}

const UnexpandMenu = ({onExpand, onSignOut, current, domains}: Props) => {
  return (
    <div>
      
    </div>
  )
}

export default UnexpandMenu
