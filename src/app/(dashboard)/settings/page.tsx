import InfoBar from '@/components/infobar'
import BillingSetting from '@/components/settings/billing-setting'
import DarModeToggle from '@/components/settings/dark-mode'
import React from 'react'

const SettingsPage =async () => {

  return (
    <>
    <InfoBar />
    <div className='overflow-y-hidden flex w-full chat-window flex-1 h-0
    flex-col gap-10
    '>
      <BillingSetting />
      <DarModeToggle />
    </div>
    </>
  )
}

export default SettingsPage