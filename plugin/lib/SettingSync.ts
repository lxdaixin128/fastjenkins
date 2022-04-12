import { ExtensionContext } from 'vscode';

class SettingSync {
  context: ExtensionContext | null;
  keys: string[];
  constructor(keys: string[]) {
    this.context = null;
    this.keys = keys;
  }

  register(context: ExtensionContext) {
    this.context = context;
    context.globalState.setKeysForSync(this.keys);
  }

  read(key: string) {
    return JSON.parse(this.context?.globalState.get(key) || '');
  }

  update(key: string, value: any) {
    this.context?.globalState.update(key, JSON.stringify(value));
  }
}

export default SettingSync;
