'use client';
import { onGetConversationMode, onToggleRealtime } from '@/actions/conversation';
import { useToast } from '@/components/ui/use-toast';
import { useChatContext } from '@/context/use-chat-context';
import { useClerk } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const useSidebar = () => {
  const [expand, setExpand] = React.useState<boolean | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [realtime, setRealtime] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { chatRoom } = useChatContext();

  const onActivateRealtime = async (e: any) => {
    try {
      const realtime = await onToggleRealtime(chatRoom!, e.target.ariaChecked == 'true' ? false : true);
      if (realtime) {
        setRealtime(realtime.chatRoom.live);
        toast({
          title: 'Success',
          description: realtime.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onGetCurrentMode = async () => {
    setLoading(true);
    const mode = await onGetConversationMode(chatRoom!);
    if (mode) {
      setRealtime(mode.live);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (chatRoom) onGetCurrentMode();
  }, [chatRoom]);

  const page = pathname.split('/').pop();

  const { signOut } = useClerk();

  const onSignOut = () => signOut(() => router.push('/'));

  const onExpand = () => setExpand((prev) => !prev);

  return {
    expand,
    onExpand,
    page,
    onSignOut,
    realtime,
    onActivateRealtime,
    chatRoom,
    loading,
  };
};

export default useSidebar;
