import * as vscode from 'vscode';
import msgCenter from './msg';

class SidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'fastJenkins.sidebarView';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    this._render();

    // 注册消息中心
    msgCenter.register(webviewView.webview);
  }

  public refresh() {
    if (this._view) {
      this._view.show?.(true);
      this._render();
      vscode.window.showInformationMessage('fastjenkins refreshed!');
    }
  }

  private _render() {
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptVscodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'static', 'vscode.js'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'main.js'));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'main.css'));
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'static', 'reset.css'));

    const nonce = getNonce();

    return `
			<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}';">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${styleMainUri}" rel="stylesheet">
					<link href="${styleResetUri}" rel="stylesheet">
				</head>
				<body>
					<div id="root">渲染失败...</div>
          <script nonce="${nonce}" src="${scriptVscodeUri}"></script>
					<script nonce="${nonce}" src="${scriptUri}"></script>
				</body>
			</html>
		`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export default SidebarViewProvider;
