import { onToggleRealtime } from '@/actions/conversation'
import { useToast } from '@/components/ui/use-toast'
import { useChatContext } from '@/context/use-chat-context'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface Props {
  
}

const UseSidebar = (props: Props) => {
  const [expand, setExpand] = React.useState<boolean | undefined>(undefined)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [realtime, setRealtime] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const { chatRoom } = useChatContext()

  const onActivateRealtime = async (e: any) => {
    try {
      const realtime = await onToggleRealtime(
        chatRoom!,
        e.target.ariaChecked == 'true' ? false : true
      )
      if (realtime) {
        setRealtime(realtime.chatRoom.live)
        toast({
          title: 'Success',
          description: realtime.message,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      
    </div>
  )
}

export default UseSidebar
