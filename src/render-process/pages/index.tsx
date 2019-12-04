import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Demo } from './mobx-demo/index';

export function App() {
  return (
    <Router>
      <div>
        <Route path="/" component={Demo} />
      </div>
    </Router>
  );
}
