import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { stores } from './stores/stores-provider';
// import { App } from './pages/index';
import  App  from './components/App';

// const injectStoreToApp = function () {
//   return (
//     <Provider {...stores}>
//       <div>aaa</div>
//     </Provider>
//   )
// }


ReactDOM.render(
  <Provider {...stores}>
           <App/>
         </Provider>,
  document.getElementById('root')
);
