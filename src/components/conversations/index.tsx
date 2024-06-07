'use client';
import { useConversation } from '@/hooks/conversation/use-conversation';
import React from 'react';
import TabsMenu from '../tabs';
import { TabsContent } from '../ui/tabs';
import { TABS_MENU } from '@/constants/menu';
import ConversationSearch from './search';
import Loader from '../loader';
import { CardDescription } from '../ui/card';
import ChatCard from './chat-card';
import { Separator } from '../ui/separator';

interface Props {
  domains:
    | {
        name: string;
        id: string;
        icon: string;
      }[]
    | undefined;
}

const ConversationMenu = ({ domains }: Props) => {
  const { register, chatRooms, loading, onGetActiveChatMessages } = useConversation();
  return (
    <div className="py-3 px-0">
      <TabsMenu triggers={TABS_MENU}>
        <TabsContent value="未读">
          <ConversationSearch domains={domains} register={register} />
          <div className="flex flex-col">
            <Loader loading={loading}>
              {chatRooms.length ? (
                chatRooms.map((room) => (
                  <ChatCard
                    seen={room.chatRoom[0].message[0]?.seen}
                    id={room.chatRoom[0].id}
                    onChat={() => onGetActiveChatMessages(room.chatRoom[0].id)}
                    createdAt={room.chatRoom[0].message[0]?.createdAt}
                    key={room.chatRoom[0].id}
                    title={room.email!}
                    description={room.chatRoom[0].message[0]?.message}
                  />
                ))
              ) : (
                <CardDescription>当前域名无聊天</CardDescription>
              )}
            </Loader>
          </div>
        </TabsContent>

        <TabsContent value="全部">
          <Separator orientation="horizontal" className="mt-5" />
          全部
        </TabsContent>
        <TabsContent value="已过期">
          <Separator orientation="horizontal" className="mt-5" />
          过期
        </TabsContent>
        <TabsContent value="收藏">
          <Separator orientation="horizontal" className="mt-5" />
          收藏
        </TabsContent>
      </TabsMenu>
    </div>
  );
};

export default ConversationMenu;
