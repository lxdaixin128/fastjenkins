import { ExtensionContext } from 'vscode';

/*
 * 本地存储能力
 * 1. 可跨项目存储
 * 2. 通过设置同步可在设备之间同步存储
 */
class StorageSync {
  context: ExtensionContext | null;
  keys: string[];
  constructor() {
    this.context = null;
    this.keys = [];
  }

  // 注册本地存储可存储的字段
  private _addKey(key: string) {
    if (this.keys.includes(key)) return;
    this.keys.push(key);
    this.context?.globalState.setKeysForSync(this.keys);
  }

  // 注册
  public register(context: ExtensionContext) {
    this.context = context;
  }

  // 读取
  public read(key: string) {
    this._addKey(key);
    return JSON.parse(this.context?.globalState.get<string>(key) ?? '{}');
  }

  // 更新
  public update(key: string, value: any) {
    this._addKey(key);
    this.context?.globalState.update(key, JSON.stringify(value));
  }
}

export default StorageSync;
