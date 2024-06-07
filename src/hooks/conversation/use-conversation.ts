import { useChatContext } from '@/context/use-chat-context';
import { ConversationSearchSchema } from './../../schemas/conversation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React from 'react';
import { z } from 'zod';
import { onGetChatMessages, onGetDomainChatRooms } from '@/actions/conversation';

export async function useConversation() {
  const { register, watch } = useForm<z.infer<typeof ConversationSearchSchema>>({
    resolver: zodResolver(ConversationSearchSchema),
    mode: 'onChange',
  });

  const { setLoading: setloadMessage, setChats, setChatRoom } = useChatContext();

  const [chatRooms, setChatRooms] = React.useState<
    {
      chatRoom: {
        id: string;
        createdAt: Date;
        message: {
          message: string;
          createdAt: Date;
          seen: boolean;
        }[];
      }[];
      email: string | null;
    }[]
  >([]);

  const [loading, setLoading] = React.useState(false);

  const onGetActiveChatMessages = async (id: string) => {
    try {
      setloadMessage(true);
      const messages = await onGetChatMessages(id);

      if (messages) {
        setChatRoom(id);
        setloadMessage(false);
        setChats(messages[0].message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const search = watch(async (values) => {
      setLoading(true);
      try {
        const rooms = await onGetDomainChatRooms(values.domain!);
        if (rooms) {
          setLoading(false);
          setChatRooms(rooms.customer);
        }
      } catch (error) {
        console.log(error);
      }
    });
    return () => search.unsubscribe();
  }, [watch]);
}
