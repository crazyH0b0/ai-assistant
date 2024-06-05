import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import Section from '../section-label'
import FormGenerator from '../forms/form-generator'

interface Props {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  message: string
}

const WelcomeMessage = ({register, errors, message}: Props) => {
  return (
    <div className='flex flex-col gap-2'>
      <Section
      label='欢迎信息'
      message='自定义欢迎信息'
      />

      <div className='lg:w-[500px] '>
        <FormGenerator register={register} inputType='textarea'
        lines={2} placeholder={message} errors={errors} name='欢迎信息' type='text'
        />
      </div>
      
    </div>
  )
}

export default WelcomeMessage
