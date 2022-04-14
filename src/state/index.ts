import { createContext } from 'react';
import { setStorage } from '../utils/storage';
const vscode = window.vscode;
export const AppContext = createContext<any>(null);
const favors: string[] = [];

const getBuilding = () => {
  const building = vscode.getState()?.building;
  const curStamp = new Date().getTime();
  if (building && building.value !== '' && curStamp - building.timestamp < building.estimatedDuration) {
    return building.value;
  }
  // 超过设置的预估过期时间(预估执行时间)则返回空，并将building置空
  setBuilding('');
  return '';
};

const setBuilding = (value: string, estimatedDuration?: number) => {
  const curStamp = new Date().getTime();
  vscode.setState({
    ...vscode.getState(),
    building: {
      value,
      timestamp: curStamp,
      estimatedDuration,
    },
  });
};

export const appState = {
  connected: 0,
  building: getBuilding(),
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
      setBuilding(action.payload, action.estimatedDuration);
      return { ...state, building: action.payload };
    case 'favors':
      const newFavors = action.payload;
      setStorage('favors', newFavors);
      return { ...state, favors: newFavors };
    case 'alias':
      const newAlias = action.payload;
      setStorage('alias', newAlias);
      return { ...state, alias: newAlias };
    default:
      throw new Error();
  }
};
