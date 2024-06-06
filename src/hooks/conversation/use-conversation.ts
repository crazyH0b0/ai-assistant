import { useChatContext } from '@/context/use-chat-context';
import { ConversationSearchSchema } from './../../schemas/conversation.schema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from 'react';

export async function useConversation() {
  const {register, watch} = useForm({
    resolver: zodResolver(ConversationSearchSchema),
    mode: 'onChange'
  })

  const {setLoading:setloadMessage, setChats, setChatRoom} = useChatContext()

  const [chatRooms, setChatRooms] = React.useState<
  {
    chatRoom: {
      id: string
      createdAt: Date
      message: {
        message: string
        createdAt: Date,
        seen: boolean
      }[]
    }[]
    email: string | undefined
  }[]
  >([])
}