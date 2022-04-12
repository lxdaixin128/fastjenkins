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

export enum MsgType {
  UserSettings,
  Connect,
  JobList,
  Build,
  BuildStatus,
  GetFavor,
  SetFavor,
  SettingSync,
}
