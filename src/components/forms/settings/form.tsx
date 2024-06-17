'use client';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/hooks/settings/use-settings';
import React from 'react';
import { DomainUpdate } from './domain-update';
import CodeSnippet from '@/components/settings/code-snippet';
import PremiumBadge from '@/icons/premium-badge';
import EditChatbotIcon from '@/components/settings/edit-chatbot-icon';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Loader from '@/components/loader';

interface Props {
  id: string;
  name: string;
  plan: any;
  chatBot: {
    id: string;
    icon: string | null;
    welcomeMessage: string | null;
  } | null;
}

const WelcomeMessage = dynamic(() => import('../../settings/welcome-message').then((props) => props.default), {
  ssr: false,
});

const SettingsForm = ({ id, name, chatBot, plan }: Props) => {
  const { deleting, loading, onDeleteDomain, onUpdateSettings, register, errors } = useSettings(id);

  return (
    <form className="flex flex-col gap-8 pb-10" onSubmit={onUpdateSettings}>
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-2xl">域名设置</h2>
        <Separator orientation="horizontal" />
        <DomainUpdate name={name} register={register} errors={errors} />
        <CodeSnippet id={id} />
      </div>

      <div className="flex flex-col gap-3 mt-5">
        <div className="flex gap-4 items-center">
          <h2 className="font-bold text-2xl">机器人设置</h2>
          <div
            className="flex gap-1 bg-cream rounded-full px-3 py-1
          text-xs items-center font-bold
          "
          >
            <PremiumBadge />
            Premium
          </div>
        </div>
        <Separator orientation="horizontal" />
        <div className="grid md:grid-cols-2 ">
          <div className="col-span-1 flex flex-col gap-5 order-last md:order-1">
            <EditChatbotIcon register={register} errors={errors} chatBot={chatBot} />

            <WelcomeMessage message={chatBot?.welcomeMessage!} register={register} errors={errors} />
          </div>

          <div className="col-span-1 relative">
            <Image src="/images/example.png" width={566} height={300} className="sticky top-0" alt="bot-ui" />
          </div>
        </div>
      </div>
      <div className="flex gap-5 justify-end">
        <Button onClick={onDeleteDomain} variant={'destructive'} type="button" className="px-10 h-[50px]">
          <Loader loading={deleting}>删除域名</Loader>
        </Button>
        <Button type="submit" className="w-[100px] h-[50px]">
          <Loader loading={loading}>保存</Loader>
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
