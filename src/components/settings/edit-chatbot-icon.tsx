import Section from '@/components/section-label';
import UploadButton from '@/components/upload-button';
import { BotIcon } from '@/icons/bot-icon';

import Image from 'next/image';
import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  chatBot: {
    id: string;
    icon: string | null;
    welcomeMessage: string | null;
  } | null;
};

const EditChatbotIcon = ({ register, errors, chatBot }: Props) => {
  return (
    <div className="py-5 flex flex-col gap-5 items-start">
      <Section label="机器人图标" message="更换机器人图标" />
      <UploadButton label="编辑图片" register={register} errors={errors} />
      {chatBot?.icon ? (
        <div className="rounded-full overflow-hidden">
          <Image
            src={`https://images.unsplash.com/photo-1611262588024-d12430b98920?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aWNvbnxlbnwwfHwwfHx8MA%3D%3D`}
            alt="bot"
            width={80}
            height={80}
          />
        </div>
      ) : (
        <div className="rounded-full cursor-pointer shadow-md w-20 h-20 flex items-center justify-center bg-grandis">
          <BotIcon />
        </div>
      )}
    </div>
  );
};

export default EditChatbotIcon;
