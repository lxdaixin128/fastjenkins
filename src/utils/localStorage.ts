import { MsgType } from '@/types';
import { sendMessage } from './message';

/*
 * 本地存储能力
 * 使用 setLocalStorage 无需注册key
 */
export function setLocalStorage(key: string, data: any) {
  return sendMessage(MsgType.Storage, {
    type: 'update',
    key,
    data,
  });
}

export function getLocalStorage(key: string) {
  return sendMessage(MsgType.Storage, {
    type: 'read',
    key,
  });
}
