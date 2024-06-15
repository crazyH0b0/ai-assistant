import CalIcon from '@/icons/cal-icon';
import ChatIcon from '@/icons/chat-icon';
import DashboardIcon from '@/icons/dashboard-icon';
import EmailIcon from '@/icons/email-icon';
import HelpDeskIcon from '@/icons/help-desk-icon';
import IntegrationsIcon from '@/icons/integrations-icon';
import SettingsIcon from '@/icons/settings-icon';
import StarIcon from '@/icons/star-icon';
import TimerIcon from '@/icons/timer-icon';

type SIDE_BAR_MENU_PROPS = {
  label: string;
  icon: JSX.Element;
  path: string;
};

export const SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
  // {
  //   label: '首页',
  //   icon: <DashboardIcon />,
  //   path: 'dashboard',
  // },
  {
    label: '设置',
    icon: <SettingsIcon />,
    path: 'settings',
  },
  {
    label: '对话',
    icon: <ChatIcon />,
    path: 'conversation',
  },
  // {
  //   label: 'Integrations',
  //   icon: <IntegrationsIcon />,
  //   path: 'integration',
  // },

  {
    label: '预约',
    icon: <CalIcon />,
    path: 'appointment',
  },
  {
    label: '邮件营销',
    icon: <EmailIcon />,
    path: 'email-marketing',
  },
];

type TABS_MENU_PROPS = {
  label: string;
  icon?: JSX.Element;
};

export const TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: '未读',
    icon: <EmailIcon />,
  },
  {
    label: '全部',
    icon: <EmailIcon />,
  },
  {
    label: '已过期',
    icon: <TimerIcon />,
  },
  {
    label: '收藏',
    icon: <StarIcon />,
  },
];

export const HELP_DESK_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'help desk',
  },
  {
    label: 'questions',
  },
];

export const APPOINTMENT_TABLE_HEADER = ['用户名', '请求时间', '添加时间', '域名'];

export const EMAIL_MARKETING_HEADER = ['Id', '邮箱', '信息回答', '域名'];

export const BOT_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: '聊天',
    icon: <ChatIcon />,
  },
  {
    label: '帮助台',
    icon: <HelpDeskIcon />,
  },
];
