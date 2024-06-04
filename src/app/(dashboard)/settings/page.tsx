import InfoBar from '@/components/infobar'
import BillingSetting from '@/components/settings/billing-setting'
import ChangePassword from '@/components/settings/change-password'
import DarModeToggle from '@/components/settings/dark-mode'
import React from 'react'

const SettingsPage =async () => {

  return (
    <>
    <InfoBar />
    <div className='overflow-y-auto  flex w-full chat-window flex-1 h-0
    flex-col gap-10
    '>
      <BillingSetting />
      <DarModeToggle />
      <ChangePassword />
    </div>
    </>
  )
}

export default SettingsPage