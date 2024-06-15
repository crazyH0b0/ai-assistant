import { SIDE_BAR_MENU } from '@/constants/menu';
import { LogOut, Menu, MonitorSmartphone } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import MenuItem from './menu-item';
import DomainMenu from './domain-menu';

interface Props {
  onExpand: () => void;
  current: string;
  onSignOut(): void;
  domains:
    | {
        id: string;
        name: string;
        icon: string;
      }[]
    | null
    | undefined;
}

const ExpandMenu = ({ onExpand, onSignOut, current, domains }: Props) => {
  return (
    <div className="py-3 px-4 flex flex-col h-full">
      <div className="flex justify-end items-center">
        {/* <Image
          src={'/images/logo.png'}
          alt="logo"
          sizes="1"
          className="animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          style={{
            width: '50%',
          }}
          width={0}
          height={0}
        /> */}
        <Menu
          className="cursor-pointer animate-fade-in 
        opacity-0 delay-300 fill-mode-forwards"
          onClick={onExpand}
        />
      </div>

      <div
        className="animate-fade-in opacity-0 delay-300 
      fill-mode-forwards flex flex-col justify-between h-full pt-10"
      >
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-3">菜单</p>
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem size="max" {...menu} key={key} current={current} />
          ))}
          <DomainMenu domains={domains} />
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-3">选项</p>
          <MenuItem size="max" label="注销" icon={<LogOut />} onSignOut={onSignOut} />
          {/* <MenuItem size="max" label="Mobile App" icon={<MonitorSmartphone />} /> */}
        </div>
      </div>
    </div>
  );
};

export default ExpandMenu;
