import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { stores } from './stores/stores-provider';
import { App } from './pages/index';

const injectStoreToApp = function () {
  return (
    <Provider {...stores}>
      <App />
    </Provider>
  )
}

ReactDOM.render(
  injectStoreToApp(),
  document.getElementById('root')
);
