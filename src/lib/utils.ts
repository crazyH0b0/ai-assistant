import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PusherClient from 'pusher-js';
import PusherServer from 'pusher';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTOR as string,
  useTLS: true,
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTOR as string,
});

// 将消息发送到包含该窗口（iframe）的父窗口
export const postToParent = (message: string) => {
  window.parent.postMessage(message, '*');
};

export const extractURLfromString = (url: string) => {
  return url.match(/https?:\/\/[^\s"<>]+/);
};

export const extractEmailsFromString = (text: string) => {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
};

export const extractUUIDFromString = (url: string) => {
  return url.match(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i);
};

export const getMonthName = (month: number) => {
  return month == 1
    ? '1/'
    : month == 2
      ? '2/'
      : month == 3
        ? '3/'
        : month == 4
          ? '4/'
          : month == 5
            ? '5/'
            : month == 6
              ? '6/'
              : month == 7
                ? '7/'
                : month == 8
                  ? '8/'
                  : month == 9
                    ? '9/'
                    : month == 10
                      ? '10/'
                      : month == 11
                        ? '11/'
                        : month == 12 && '12/';
};
