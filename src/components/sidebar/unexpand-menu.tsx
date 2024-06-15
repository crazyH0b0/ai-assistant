import { SIDE_BAR_MENU } from '@/constants/menu';
import React from 'react';
import MenuItem from './menu-item';
import DomainMenu from './domain-menu';
import { LogOut, MonitorSmartphone } from 'lucide-react';
import { MenuLogo } from '@/icons/menu-logo';

interface Props {
  onShrink(): void;
  current: string;
  onSignOut(): void;
  domains:
    | {
        id: string;
        name: string;
        icon: string | null;
      }[]
    | null
    | undefined;
}

const UnexpandMenu = ({ onShrink, onSignOut, current, domains }: Props) => {
  return (
    <div className="p-3 flex flex-col items-center h-full">
      <span className="animate-fade-in opacity-0 delay-300 fill-mode-forwards cursor-pointer">
        <MenuLogo onClick={onShrink} />
      </span>
      <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
        <div className="flex flex-col">
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem size="min" {...menu} key={key} current={current} />
          ))}
          <DomainMenu min domains={domains} />
        </div>
        <div className="flex flex-col">
          <MenuItem size="min" label="注销" icon={<LogOut />} onSignOut={onSignOut} />
          {/* <MenuItem size="min" label="Mobile App" icon={<MonitorSmartphone />} /> */}
        </div>
      </div>
    </div>
  );
};

export default UnexpandMenu;
