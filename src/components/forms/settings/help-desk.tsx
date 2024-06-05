"use client"
import Section from '@/components/section-label'
import TabsMenu from '@/components/tabs'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { useHelpDesk } from '@/hooks/settings/use-settings'
import React from 'react'
import FormGenerator from '../form-generator'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loader'
import Accordion from '@/components/accordion'

interface Props {
  id: string
}

const HelpDesk = ({id}: Props) => {
  const {register, errors, onSubmitQuestion, loading ,questions} = useHelpDesk(id)

  return (
    <Card className='w-full grid grid-cols-1 lg:grid-cols-2'>
      <CardContent className='p-6 border-r-[1px]'>
        <CardTitle>技术支持</CardTitle>

      <form onSubmit={onSubmitQuestion} className='flex flex-col gap-6 mt-10'>
        <div className='flex flex-col gap-3'>
          <Section label='问题' message='添加你认为会被经常问到的问题' />
          <FormGenerator
          inputType='input'
          register={register}
          errors={errors}
          name='question'
          placeholder='输入问题'
          type='text'
          />
        </div>

        <div className='flex flex-col gap-3'>
          <Section label='问题的答案' message='输入上述问题的答案' />
          <FormGenerator
          inputType='textarea'
          register={register}
          errors={errors}
          name='answer'
          placeholder='输入答案'
          type='text'
          lines={5}
          />
        </div>
        <Button type='submit' className='bg-orange hover:bg-orange hover:opacity-70
        transition duration-150 ease-in-out  font-semibold text-white
        '>创 建</Button>
      </form>
      </CardContent>

      <CardContent className='p-6 overflow-y-auto chat-window'>
        <Loader loading={loading}>
          {
            questions.length > 0 ? (
              questions.map(question =>
                <Accordion key={question.id}
                 trigger={question.question}
                 content={question.answer} />
              ))
              : 
              (
                <CardDescription>问题为空</CardDescription>
              )

            
          }

        </Loader>
      </CardContent>
      
    </Card>
  )
}

export default HelpDesk
