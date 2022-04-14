import { MsgType } from '@/types';

const msgMap = new Map<string, (data: Message) => void>();

window.addEventListener('message', ({ data }: MessageEvent<Message>) => {
  const callback = msgMap.get(data.hash);
  callback && callback(data);
});

export function sendMessage(type: MsgType, data?: any): Promise<Message> {
  return new Promise((resolve, reject) => {
    const hash = getNonce(); // 为每个请求标记hash
    const callback = (data: Message) => {
      resolve(data);
      msgMap.delete(hash);
    };
    msgMap.set(hash, callback);
    window.vscode.postMessage({ type, hash, data });
  });
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
