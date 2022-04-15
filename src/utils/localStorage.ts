import { MsgType } from '@/types';
import { sendMessage } from './message';

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
