const vscode = window.vscode;

export function setSessionStorage(key: string, data: any) {
  vscode.setState({
    ...vscode.getState(),
    [key]: data,
  });
}

export function getSessionStorage(key: string) {
  return vscode.getState()[key];
}
