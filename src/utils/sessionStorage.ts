const vscode = window.vscode;

export function setSessionStorage(key: string, data: any) {
  vscode.setState({
    ...vscode.getState(),
    [key]: data,
  });
}

export function getSessionStorage(key: string) {
  const state = vscode.getState();
  return state && state[key];
}
