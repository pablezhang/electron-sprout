import * as ReactDOM from 'react-dom';
import { App } from './pages/index';

export const startMainWindowRender = () => {
  ReactDOM.render(
    App(),
    document.getElementById('root')
  );
}

// ReactDOM.render(
//   App(),
//   document.getElementById('root')
// );
