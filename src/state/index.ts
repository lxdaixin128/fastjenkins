import { createContext, useReducer } from 'react';
const vscode = window.vscode;
export const AppContext = createContext<any>(null);
const favors: string[] = vscode.getState().favors || [];

export const appState = {
  connected: 0,
  building: '',
  userInfo: {
    userName: '',
    userId: '',
    email: '',
  },
  favors,
};

export const appAction = (state: typeof appState, action: any) => {
  switch (action.type) {
    case 'userInfo':
      Object.assign(state.userInfo, action.payload);
      return { ...state };
    case 'connected':
      return { ...state, connected: action.payload };
    case 'building':
      return { ...state, building: action.payload };
    case 'favors':
      const newFavors = action.payload;
      vscode.setState({
        ...vscode.getState(),
        favors: newFavors,
      });
      return { ...state, favors: newFavors };
    default:
      throw new Error();
  }
};
