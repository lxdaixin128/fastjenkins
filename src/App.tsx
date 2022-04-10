import { ReactElement, useContext, useReducer } from 'react';
import { AppContext, appState, appAction } from './state';
import Home from './views/home';
function App(): ReactElement {
  const [state, dispatch] = useReducer(appAction, appState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Home />
    </AppContext.Provider>
  );
}

export default App;
