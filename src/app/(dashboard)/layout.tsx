import { onLoginUser } from '@/actions/auth';
import Sidebar from '@/components/sidebar';
import { ChatProvider } from '@/context/use-chat-context';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const OwnerLayout = async ({ children }: Props) => {
  const authenticated = await onLoginUser();

  if (!authenticated) return null;

  return (
    // <ChatProvider>
    <div className="flex h-screen w-full">
      <Sidebar domains={authenticated.domains?.domains} />
      <div className="w-full h-screen flex flex-col pl-20 md:pl-10">{children}</div>
    </div>
    // </ChatProvider>
  );
};

export default OwnerLayout;
