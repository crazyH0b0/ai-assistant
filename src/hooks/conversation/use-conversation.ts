import { useChatContext } from '@/context/use-chat-context';
import { ConversationSearchSchema, ChatBotMessageSchema } from './../../schemas/conversation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React from 'react';
import { z } from 'zod';
import {
  onGetChatMessages,
  onGetDomainChatRooms,
  onOwnerSendMessage,
  onRealTimeChat,
  onViewUnReadMessages,
} from '@/actions/conversation';
import { getMonthName, pusherClient } from '@/lib/utils';

export function useChatWindow() {
  const { chats, loading, setChats, chatRoom } = useChatContext();

  const messageWindowRef = React.useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset } = useForm<z.infer<typeof ChatBotMessageSchema>>({
    resolver: zodResolver(ChatBotMessageSchema),
    mode: 'onChange',
  });

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  React.useEffect(() => {
    onScrollToBottom();
  }, [chats, messageWindowRef]);

  React.useEffect(() => {
    if (chatRoom) {
      pusherClient.subscribe(chatRoom);
      pusherClient.bind('realtime-mode', (data: any) => {
        setChats((prev) => [...prev, data.chat]);
      });

      return () => {
        pusherClient.unbind('realtime-mode');
        pusherClient.unsubscribe(chatRoom);
      };
    }
  }, [chatRoom]);

  // 真人发送
  const onHandleSentMessage = handleSubmit(async (values) => {
    try {
      reset();
      const message = await onOwnerSendMessage(chatRoom!, values.content!, 'assistant');
      if (message) {
        // setChats((prev) => [...prev, message.message[0]]);

        await onRealTimeChat(chatRoom!, message.message[0].message, message.message[0].id, 'assistant');
      }
    } catch (error) {
      console.log(error);
    }
  });

  return {
    messageWindowRef,
    register,
    onHandleSentMessage,
    chats,
    loading,
    chatRoom,
  };
}

export const useChatTime = (createdAt: Date, roomId: string) => {
  const { chatRoom } = useChatContext();
  const [messageSentAt, setMessageSentAt] = React.useState<string>();
  const [urgent, setUrgent] = React.useState<boolean>(false);

  const onSetMessageReceivedDate = () => {
    const dt = new Date(createdAt); // 将消息的创建时间转换为 Date 对象
    const current = new Date(); // 获取当前时间
    const currentDate = current.getDate(); // 获取当前日期（1-31）
    const hr = dt.getHours(); // 获取消息创建时间的小时部分（0-23）
    const min = dt.getMinutes(); // 获取消息创建时间的分钟部分（0-59）
    const date = dt.getDate(); // 获取消息创建时间的日期（1-31）
    const month = dt.getMonth(); // 获取消息创建时间的月份（0-11）
    const difference = currentDate - date; // 计算当前日期和消息创建日期之间的差异

    if (difference <= 0) {
      // 如果当前日期和消息创建日期在同一天或消息创建日期在未来
      setMessageSentAt(`${hr > 12 ? '下午' : '上午'} ${hr}:${min}`); // 设置消息发送时间为 "小时:分钟 AM/PM"
      if (current.getHours() - dt.getHours() < 2) {
        // 如果消息创建时间和当前时间的小时差小于 2 小时
        setUrgent(true); // 将消息标记为紧急
      }
    } else {
      // 如果消息创建日期不是今天
      setMessageSentAt(`${getMonthName(month)}${date}`); // 设置消息发送时间为 "日期 月份"
    }
  };

  const onSeenChat = async () => {
    if (chatRoom == roomId && urgent) {
      await onViewUnReadMessages(roomId);
      setUrgent(false);
    }
  };

  React.useEffect(() => {
    onSeenChat();
  }, [chatRoom]);

  React.useEffect(() => {
    onSetMessageReceivedDate();
  }, []);

  return { messageSentAt, urgent, onSeenChat };
};

export function useConversation() {
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

  // 当选中某个聊天室时，根据该聊天室的 ID 获取其相关聊天记录
  const onGetActiveChatMessages = async (id: string) => {
    try {
      setloadMessage(true);
      const messages = await onGetChatMessages(id);

      if (messages) {
        // 将当前聊天的状态保存在 context 中
        setChatRoom(id);
        setloadMessage(false);
        setChats(messages.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    // 监听所有的 input 值变化
    const search = watch(async (values) => {
      setLoading(true);

      try {
        // 更具域名 id 获取当前域名下的所有聊天室
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

  return {
    register,
    chatRooms,
    loading,
    onGetActiveChatMessages,
  };
}
