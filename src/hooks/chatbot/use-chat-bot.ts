import { onAiChatBotAssistant, onGetCurrentChatBot } from '@/actions/chatbot';
import { postToParent, pusherClient } from '@/lib/utils';
import { ChatBotMessageSchema } from '@/schemas/conversation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function useChatBot() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof ChatBotMessageSchema>>({
    resolver: zodResolver(ChatBotMessageSchema),
  });

  const [currentBot, setCurrentBot] = React.useState<
    | {
        name: string;
        chatBot: {
          id: string;
          icon: string | null;
          welcomeMessage: string | null;
          background: string | null;
          textColor: string | null;
          helpdesk: boolean;
        } | null;
        helpdesk: {
          id: string;
          question: string;
          answer: string;
          domainId: string | null;
        }[];
      }
    | undefined
  >();

  const messageWindowRef = React.useRef<HTMLDivElement | null>(null);
  const [botOpened, setBotOpened] = React.useState<boolean>(false);
  const onOpenChatBot = () => setBotOpened((prev) => !prev);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [onChats, setOnChats] = React.useState<{ role: 'assistant' | 'user'; content: string; link?: string }[]>([]);
  const [onAiTyping, setOnAiTyping] = React.useState<boolean>(false);
  const [currentBotId, setCurrentBotId] = React.useState<string>();
  const [onRealTime, setOnRealTime] = React.useState<{ chatroom: string; mode: boolean } | undefined>(undefined);

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  // 将聊天窗口滚动到底部
  React.useEffect(() => {
    onScrollToBottom();
  }, [onChats, messageWindowRef]);

  // 分别在聊天窗口打开时调用
  React.useEffect(() => {
    postToParent(
      JSON.stringify({
        width: botOpened ? 550 : 80,
        height: botOpened ? 800 : 80,
      })
    );
  }, [botOpened]);

  let limitRequest = 0;

  // 获取当前网站的聊天机器人
  const onGetDomainChatBot = async (id: string) => {
    setCurrentBotId(id);
    const chatbot = await onGetCurrentChatBot(id);
    // TODO: 再次进入聊天室发送欢迎信息?
    if (chatbot) {
      setOnChats((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: chatbot.chatBot?.welcomeMessage!,
        },
      ]);
      setCurrentBot(chatbot);
      setLoading(false);
    }
  };

  // 监听消息事件，获取聊天机器人ID
  React.useEffect(() => {
    window.addEventListener('message', (e) => {
      console.log(e.data);
      const botId = e.data;
      // 避免多次访问 chatbot 的信息
      if (limitRequest < 1 && typeof botId == 'string') {
        onGetDomainChatBot(botId);
        limitRequest++;
      }
    });
  }, []);

  // 开始聊天
  const onStartChatting = handleSubmit(async (values) => {
    console.log('ALL VALUES', values);
    // 如果上传有图片
    if (values.image.length) {
      console.log('IMAGE fROM ', values.image[0]);
      // const uploaded = await upload.uploadFile(values.image[0]);
      if (!onRealTime?.mode) {
        setOnChats((prev: any) => [
          ...prev,
          {
            role: 'user',
            // content: uploaded.uuid,
          },
        ]);
      }

      // console.log('🟡 RESPONSE FROM UC', uploaded.uuid);
      // 用户发送完内容后，开始调用 AI 对话
      setOnAiTyping(true);
      // const response = await onAiChatBotAssistant(currentBotId!, onChats, 'user', uploaded.uuid);
      const response = await onAiChatBotAssistant(currentBotId!, onChats, 'user', 'uploaduuid');

      if (response) {
        setOnAiTyping(false);
        if (response.live) {
          setOnRealTime((prev) => ({
            ...prev,
            chatroom: response.chatRoom,
            mode: response.live,
          }));
        } else {
          setOnChats((prev: any) => [...prev, response.response]);
        }
      }
    }
    reset();

    // 处理文本消息
    if (values.content) {
      if (!onRealTime?.mode) {
        setOnChats((prev: any) => [
          ...prev,
          {
            role: 'user',
            content: values.content,
          },
        ]);
      }

      setOnAiTyping(true);

      const response = await onAiChatBotAssistant(currentBotId!, onChats, 'user', values.content);

      if (response) {
        setOnAiTyping(false);
        // 人工接管
        if (response.live) {
          setOnRealTime((prev) => ({
            ...prev,
            chatroom: response.chatRoom,
            mode: response.live,
          }));
        } else {
          setOnChats((prev: any) => [...prev, response.response]);
        }
      }
    }
  });

  return {
    botOpened,
    onOpenChatBot,
    onStartChatting,
    onChats,
    register,
    onAiTyping,
    messageWindowRef,
    currentBot,
    loading,
    setOnChats,
    onRealTime,
    errors,
  };
}

export const useRealTime = (
  chatRoom: string,
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        role: 'user' | 'assistant';
        content: string;
        link?: string | undefined;
      }[]
    >
  >
) => {
  // const counterRef = React.useRef(1);
  // React.useEffect(() => {
  //   pusherClient.subscribe(chatRoom);
  //   pusherClient.bind('realtime-mode', (data: any) => {
  //     console.log('✅', data);
  //     if (counterRef.current !== 1) {
  //       setChats((prev: any) => [
  //         ...prev,
  //         {
  //           role: data.chat.role,
  //           content: data.chat.message,
  //         },
  //       ]);
  //     }
  //     counterRef.current += 1;
  //   });
  //   return () => {
  //     pusherClient.unbind('realtime-mode');
  //     pusherClient.unsubscribe(chatRoom);
  //   };
  // }, []);
};
