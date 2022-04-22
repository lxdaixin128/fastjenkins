import { createContext } from 'react';
import { setLocalStorage } from '../utils/localStorage';

interface UserInfo {
  userId: string;
  userName: string;
  email?: string;
}
interface AppState {
  connected: number;
  userInfo: UserInfo;
  alias: string[];
  favors: string[];
  hiddenProperties: string[];
  settings: Record<string, boolean>;
}

interface Action {
  type: string;
  payload: any;
}

export const AppContext = createContext<any>(null);

export const appState: AppState = {
  connected: 0,
  userInfo: {
    userId: '',
    userName: '',
    email: '',
  },
  alias: [],
  favors: [],
  hiddenProperties: [],
  settings: {
    aliasHidden: false,
    propertiesSwitchShow: false,
  },
};

export const appAction = (state: AppState, action: Action) => {
  switch (action.type) {
    case 'userInfo':
      Object.assign(state.userInfo, action.payload);
      return { ...state };
    case 'connected':
      return { ...state, connected: action.payload };
    case 'favors':
      const newFavors = action.payload;
      setLocalStorage('favors', newFavors);
      return { ...state, favors: newFavors };
    case 'hiddenProperties':
      const newHiddenProperties = action.payload;
      setLocalStorage('hiddenProperties', newHiddenProperties);
      return { ...state, hiddenProperties: newHiddenProperties };
    case 'alias':
      const newAlias = action.payload;
      setLocalStorage('alias', newAlias);
      return { ...state, alias: newAlias };
    case 'settings':
      const [key, value] = action.payload;
      state.settings[key] = value;
      return { ...state };
    default:
      throw new Error();
  }
};
