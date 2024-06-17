'use client';
import { useChatWindow } from '@/hooks/conversation/use-conversation';
import { PaperclipIcon } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Loader from '../loader';
import Bubble from '../chatbot/bubble';

const Messager = () => {
  const { messageWindowRef, chats, loading, chatRoom, onHandleSentMessage, register } = useChatWindow();
  return (
    <div className="flex-1 flex flex-col h-0 relative">
      <div className="flex-1 h-0 w-full flex flex-col">
        <Loader loading={loading}>
          <div
            ref={messageWindowRef}
            className="w-full flex-1 h-0 flex flex-col gap-3 pl-5 py-5 chat-window overflow-y-auto"
          >
            {chats.length ? (
              chats.map((chat) => (
                <Bubble
                  key={chat.id}
                  message={{
                    role: chat.role!,
                    content: chat.message,
                  }}
                  createdAt={chat.createdAt}
                />
              ))
            ) : (
              <div>当前无聊天选中~</div>
            )}
          </div>
        </Loader>
      </div>
      <form onSubmit={onHandleSentMessage} className="flex px-3 pt-3 pb-10 flex-col backdrop-blur-sm bg-muted w-full">
        <div className="flex justify-between">
          <Input
            {...register('content')}
            placeholder="输入消息..."
            className="focus-visible:ring-0 flex-1 p-0 focus-visible:ring-offset-0 bg-muted rounded-none outline-none border-none"
          />
          <Button type="submit" className="mt-3 px-7" disabled={!chatRoom}>
            发送
          </Button>
        </div>
        {/* <span>
          <PaperclipIcon className="text-muted-foreground" />
        </span> */}
      </form>
    </div>
  );
};

export default Messager;
