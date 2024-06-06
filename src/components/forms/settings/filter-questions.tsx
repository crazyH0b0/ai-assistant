"use client"

import Section from '@/components/section-label'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { useFilterQuestions, useHelpDesk } from '@/hooks/settings/use-settings'
import React from 'react'
import FormGenerator from '../form-generator'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loader'
import Accordion from '@/components/accordion'

interface Props {
  id: string
  
}

const FilterQuestions = ({id}: Props) => {
  const {onAddFilterQuestions, errors, loading, register, questions} = useFilterQuestions(id)
  
  
  return (
    <Card className='w-full grid grid-cols-1 lg:grid-cols-2'>
      <CardContent className='p-6 border-r-[1px]'>
        <CardTitle>帮助中心</CardTitle>
        <form onSubmit={onAddFilterQuestions} className='flex flex-col gap-6 mt-10'>
          <div className='flex flex-col gap-3'>
            <Section label='问题' message='添加你想机器人询问的问题' />
            <FormGenerator
            type='text'
            form='filterForm'
            inputType='input'
            register={register}
            errors={errors}
            name='question'
            placeholder='输入问题'
            />
          </div>
          <div className='flex flex-col gap-3'>
            <Section label='问题答案' message='上述问题的答案' />
            <FormGenerator
            type='text'
            form='filterForm'
            inputType='textarea'
            register={register}
            errors={errors}
            name='answer'
            placeholder='输入答案'
            lines={5}
            />
          </div>
          <Button type='submit' className='bg-orange hover:bg-orange hover:opacity-70 
          transition duration-150 ease-in-out font-semibold text-white 
          '>创 建</Button>
        </form>
      </CardContent>

      <CardContent className='p-6 overflow-y-auto chat-window'>
        <Loader loading={loading}>
          {
            questions.length ? (
             questions.map(question => (
              <p key={question.id} className='font-bold'>
                {question.question}
              </p>
            ))
            ) : (
              <CardDescription>问题为空</CardDescription>
            )
          }
        </Loader>
      </CardContent>      
    </Card>
  )
}

export default FilterQuestions
