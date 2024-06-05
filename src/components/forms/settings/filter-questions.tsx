"use client"

import { useFilterQuestions } from '@/hooks/settings/use-settings'
import React from 'react'

interface Props {
  id: string
  
}

const FilterQuestions = ({id}: Props) => {
  const {onAddFilterQuestions, errors, loading, register, questions} = useFilterQuestions(id)
  return (
    <div>
      
    </div>
  )
}

export default FilterQuestions
