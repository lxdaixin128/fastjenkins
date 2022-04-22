import { Webview } from 'vscode';
import { AxiosPromise } from 'axios';
import { MsgType } from '@/types';
interface MsgReducer {
  (value?: any): Promise<any> | AxiosPromise;
}

class MsgCenter {
  msgCenter: Map<MsgType, MsgReducer>;
  webview: Webview | null;
  constructor() {
    this.msgCenter = new Map();
    this.webview = null;
  }

  register(webview: Webview) {
    this.webview = webview;
    webview.onDidReceiveMessage((msg: Message) => {
      const fn = this.msgCenter.get(msg.type);
      if (fn) {
        fn.call(this, msg.data)
          .then((data: any) => {
            webview.postMessage({
              status: 200,
              type: msg.type,
              data,
              hash: msg.hash,
            } as Message);
          })
          .catch((err) => {
            webview.postMessage({
              status: 500,
              type: msg.type,
              message: '连接失败',
              hash: msg.hash,
            });
          });
      }
    });
  }

  subscribe(name: MsgType, fn: MsgReducer) {
    this.msgCenter.set(name, fn);
  }
}

export default MsgCenter;
