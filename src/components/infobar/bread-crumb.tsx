'use client';

import useSidebar from '@/hooks/sidebar/use-sidebar';
import React from 'react';
import { Switch } from '../ui/switch';
import Loader from '../loader';

type Props = {};

const BreadCrumb = (props: Props) => {
  const { chatRoom, expand, loading, onActivateRealtime, onExpand, page, onSignOut, realtime } = useSidebar();
  return (
    <div className="flex flex-col ">
      <div className="flex gap-5 items-center">
        {/* <h2 className="text-3xl font-bold capitalize">1</h2> */}
        {page === 'conversation' && chatRoom && (
          <Loader loading={loading} className="p-0 inline">
            <Switch
              defaultChecked={realtime}
              onClick={(e) => onActivateRealtime(e)}
              className="data-[state=checked]:bg-orange data-[state=unchecked]:bg-peach"
            />
          </Loader>
        )}
      </div>
      <p className="text-gray-500 text-sm">
        {page == 'settings'
          ? '管理账户设置和偏好'
          : page == 'dashboard'
            ? 'hhhh'
            : page == 'appointment'
              ? '查看和编辑预约'
              : page == 'email-marketing'
                ? '批量发送邮件给您的客户'
                : page == 'integration'
                  ? 'hhh'
                  : ' '}
      </p>
    </div>
  );
};

export default BreadCrumb;
