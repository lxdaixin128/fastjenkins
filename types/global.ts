declare global {
  interface Window {
    vscode: any;
  }

  interface Message {
    type: MsgType;
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
}
