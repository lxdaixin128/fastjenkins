import { ReactElement, useEffect, useReducer } from 'react';
import { AppContext, appState, appAction } from './state';
import { getLocalStorage } from './utils/localStorage';
import Home from './views/home';
function App(): ReactElement {
  const [state, dispatch] = useReducer(appAction, appState);

  // 获取收藏和备注的设置信息
  useEffect(() => {
    getLocalStorage('favors').then((res: any) => {
      dispatch({
        type: 'favors',
        payload: res.data,
      });
    });

    getLocalStorage('alias').then((res: any) => {
      dispatch({
        type: 'alias',
        payload: res.data,
      });
    });
  }, []);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Home />
    </AppContext.Provider>
  );
}

export default App;
