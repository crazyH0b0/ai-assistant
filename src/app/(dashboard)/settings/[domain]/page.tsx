import { onGetCurrentDomain } from '@/actions/settings';
import BotTraningForm from '@/components/forms/settings/bot-traning';
import SettingsForm from '@/components/forms/settings/form';
import InfoBar from '@/components/infobar';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: { domain: string };
}

const DomainSettingPage = async ({ params }: Props) => {
  const domain = await onGetCurrentDomain(params.domain);
  if (!domain) return redirect('/settings');

  return (
    <>
      <InfoBar />
      <div className="overflow-y-auto w-full chat-window flex-1 h-0">
        <SettingsForm
          plan={domain.subscription?.plan}
          chatBot={domain.domains[0].chatBot}
          id={domain.domains[0].id}
          name={domain.domains[0].name}
        />
        <BotTraningForm id={domain.domains[0].id} />
      </div>
    </>
  );
};

export default DomainSettingPage;
