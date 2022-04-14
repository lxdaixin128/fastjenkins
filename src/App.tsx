import { ReactElement, useContext, useEffect, useReducer } from 'react';
import { AppContext, appState, appAction } from './state';
import { getStorage } from './utils/storage';
import Home from './views/home';
function App(): ReactElement {
  const [state, dispatch] = useReducer(appAction, appState);
  useEffect(() => {
    getStorage('favors').then((res: any) => {
      dispatch({
        type: 'favors',
        payload: res.data,
      });
    });

    getStorage('alias').then((res: any) => {
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
