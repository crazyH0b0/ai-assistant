"use client"
import useDomain from '@/hooks/sidebar/use-domain'
import { cn } from '@/lib/utils'
import React from 'react'
import AppDrawer from '../drawer'
import { Plus } from 'lucide-react'
import Loader from '../loader'
import FormGenerator from '../forms/form-generator'
import UploadButton from '../upload-button'

interface Props {
  min?: boolean
  domains:
    | {
        id: string
        name: string
        icon: string | null
      }[]
    | null
    | undefined
}

const DomainMenu = ({ domains, min }: Props) => {
  const { register, onAddDomain, loading, errors, isDomain } = useDomain()

  return (
    <div className={cn('flex flex-col gap-3',
    min ? 'mt-6' : 'mt-3'
     )}>
      <div className='flex justify-between w-full items-center'>
        {!min && <p className='text-xs text-gray-500'>域名</p> }
        <AppDrawer description='输入需要嵌入机器人的域名' title='添加域名'
        onOpen={<div className='cursor-pointer text-gray-500 rounded-full border-2'>
          <Plus />
        </div>}
        >
          <Loader loading={loading}>
            <form className='flex flex-col mt-3 w-6/12 gap-3' onSubmit={onAddDomain}>
              <FormGenerator
              inputType='input'
              register={register}
              label='域名'
              name='域名'
              errors={errors}
              placeholder='baidu.com'
              type='text'
              />
              <UploadButton register={register} errors={errors} label='上传图标' />
            </form>
          </Loader>
        </AppDrawer>
        
      </div>
      
    </div>
  )
}

export default DomainMenu
