import { MsgType } from './index';

declare global {
  interface Window {
    vscode: any;
  }

  interface Message {
    type: MsgType;
    hash: string;
    status?: number;
    data?: any;
    msg?: string;
  }
}
