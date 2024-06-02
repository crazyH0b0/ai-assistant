import { USER_REGISTRATION_FORM } from '@/constants/form'
import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import FormGenerator from '../form-generator'

interface Props {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  
}

const AccountDetailForm = ({register, errors}: Props) => {
  return (
    <>
      <h2 className='text-gravel md:text-4xl font-bold'>用户详情</h2>
      {
        USER_REGISTRATION_FORM.map((field) => (
          <FormGenerator
          key={field.id}
          {...field}
          errors={errors}
          register={register}
          name={field.name}
          />

        
        ))
      }
    </>
  )
}

export default AccountDetailForm
