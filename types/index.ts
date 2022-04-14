// 枚举类型需要手动导入，否则打包不编译
export enum MsgType {
  UserSettings,
  Connect,
  JobList,
  Build,
  BuildStatus,
  GetFavor,
  SetFavor,
  Storage,
}
