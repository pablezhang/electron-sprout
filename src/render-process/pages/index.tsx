import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Demo } from './mobx-demo/index';
import { stores } from '../stores/stores';

export function App() {
  return (
    <Provider {...stores}>
      <Router>
        <div>
          <Route path="/" component={Demo} />
        </div>
      </Router>
    </Provider>
  );
}
