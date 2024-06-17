'use client';
import useDomain from '@/hooks/sidebar/use-domain';
import { cn } from '@/lib/utils';
import React from 'react';
import AppDrawer from '../drawer';
import { Plus } from 'lucide-react';
import Loader from '../loader';
import FormGenerator from '../forms/form-generator';
import UploadButton from '../upload-button';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  min?: boolean;
  domains:
    | {
        id: string;
        name: string;
        icon: string | null;
      }[]
    | null
    | undefined;
}

const DomainMenu = ({ domains, min }: Props) => {
  const { register, onAddDomain, loading, errors, isDomain } = useDomain();

  return (
    <div className={cn('flex flex-col gap-3', min ? 'mt-6' : 'mt-3')}>
      <div className="flex justify-between w-full items-center">
        {!min && <p className="text-xs text-gray-500">域名</p>}
        <AppDrawer
          description="输入需要嵌入机器人的域名"
          title="添加域名"
          onOpen={
            <div className="cursor-pointer text-gray-500 rounded-full border-2">
              <Plus />
            </div>
          }
        >
          <Loader loading={loading}>
            <form className="flex flex-col mt-3 w-6/12 gap-3" onSubmit={onAddDomain}>
              <FormGenerator
                inputType="input"
                register={register}
                label="域名"
                name="domain"
                errors={errors}
                placeholder="baidu.com"
                type="text"
              />
              {/* <UploadButton register={register} errors={errors} label='上传图标' /> */}
              <Button className="w-full" type="submit">
                添加域名
              </Button>
            </form>
          </Loader>
        </AppDrawer>
      </div>
      <div className="flex flex-col gap-1 text-ironside font-medium">
        {domains &&
          domains.map((domain) => (
            <Link
              href={`/settings/${domain.name.split('.')[0]}`}
              key={domain.id}
              className={cn(
                'flex gap-3 justify-center hover:bg-white rounded-full transition duration-100 ease-in-out cursor-pointer ',
                !min ? 'p-2' : 'py-2',
                domain.name.split('.')[0] == isDomain && 'bg-white'
              )}
            >
              <Image src={'/images/website.png'} alt="logo" width={20} height={20} />
              {!min && <p className="text-sm">{domain.name}</p>}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default DomainMenu;
