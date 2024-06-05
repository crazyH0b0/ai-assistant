import { TabsContent } from '@/components/ui/tabs'
import TABS_MENU  from '@/components/tabs/index'
import React from 'react'
import { HELP_DESK_TABS_MENU } from '@/constants/menu'
import HelpDesk from './help-desk'
import FilterQuestions from './filter-questions'

interface Props {
  id: string
  
}

const BotTraningForm = ({id}: Props) => {
  return (
    <div className='py-5 mb-10 flex flex-col gap-5 items-start '>
      <div className='flex flex-col gap-2'>
        <h2 className='font-bold text-2xl'>训练机器人</h2>
        <p className='text-sm font-light'>
          设置 FAQ 问题，训练机器人的回答方式
        </p>  
        </div>
        <TABS_MENU triggers={HELP_DESK_TABS_MENU}>
        <TabsContent
          value="help desk"
          className="w-full"
        >
          <HelpDesk id={id} />
        </TabsContent>
        <TabsContent value="questions">
          <FilterQuestions id={id} />
        </TabsContent>
      </TABS_MENU>    
    </div>
  )
}

export default BotTraningForm
