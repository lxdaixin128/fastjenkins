import { MsgType } from '@/types';
import { sendMessage } from './message';

export function setStorage(key: string, data: any) {
  return sendMessage(MsgType.Storage, {
    type: 'update',
    key,
    data,
  });
}

export function getStorage(key: string) {
  return sendMessage(MsgType.Storage, {
    type: 'read',
    key,
  });
}
