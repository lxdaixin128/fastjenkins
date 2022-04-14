// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import storage from './storage';
import SidebarViewProvider from './SidebarViewProvider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new SidebarViewProvider(context.extensionUri);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(SidebarViewProvider.viewType, provider));

  // 注册本地存储
  storage.register(context);

  // 刷新sidebarView
  context.subscriptions.push(
    vscode.commands.registerCommand('sidebarView.refreshEntry', () => {
      provider.refresh();
    }),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
