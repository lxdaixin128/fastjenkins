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
        payload: Array.from(res.data), // 首次加载返回空对象，使用array.from转换
      });
    });

    getLocalStorage('hiddenProperties').then((res: any) => {
      dispatch({
        type: 'hiddenProperties',
        payload: Array.from(res.data),
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
