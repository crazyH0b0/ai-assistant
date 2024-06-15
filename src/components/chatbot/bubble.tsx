import React from 'react';
import { cn, extractUUIDFromString, getMonthName } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MySvgComponent from '@/icons/ai-assis';

interface Props {
  message: {
    role: 'assistant' | 'user';
    content: string;
    link?: string;
  };
  createdAt?: Date;
}

const Bubble = ({ message, createdAt }: Props) => {
  let d = new Date();
  const image = extractUUIDFromString(message.content);

  return (
    <div
      className={cn('flex gap-2 items-end', message.role == 'assistant' ? 'self-start' : 'self-end flex-row-reverse')}
    >
      {message.role == 'assistant' ? (
        <Avatar className="w-5 h-5">
          <MySvgComponent />
        </Avatar>
      ) : (
        <Avatar className="w-5 h-5">
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'flex flex-col gap-3 min-w-[200px] max-w-[300px] p-4 rounded-t-md',
          message.role == 'assistant' ? 'bg-muted rounded-r-md' : 'bg-grandis rounded-l-md'
        )}
      >
        {createdAt ? (
          <div className="flex gap-2 text-xs text-gray-600">
            <p>
              {getMonthName(createdAt.getMonth())} {createdAt.getDate()}
            </p>
            <p>
              {createdAt.getHours() > 12 ? '下午' : '上午'}
              {}
              {createdAt.getHours()}:{createdAt.getMinutes()}
            </p>
          </div>
        ) : (
          <p className="text-xs">{`${d.getHours()}:${d.getMinutes()} ${d.getHours() > 12 ? '下午' : '上午'}`}</p>
        )}
        {image ? (
          <div className="relative aspect-square">
            {/* <Image src={`https://ucarecdn.com/${image[0]}/`} fill alt="image" /> */}
            <Image src="" fill alt="image" />
          </div>
        ) : (
          <p className="text-sm">
            {message.content.replace('(complete)', ' ')}
            {message.link && (
              <Link className="underline font-bold pl-2" href={message.link} target="_blank">
                链接
              </Link>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default Bubble;
