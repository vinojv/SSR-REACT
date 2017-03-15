/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import getRoutes from './routes';
import { Router, browserHistory } from 'react-router';
const _browserHistory = useScroll(() => browserHistory)();
const dest = document.getElementById('content');
// const history = syncHistoryWithStore(_browserHistory, store);

const component = (
  <Router history={_browserHistory}>
    {getRoutes()}
  </Router>
);

ReactDOM.render(component, dest);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
      <div>
        {component}
        <DevTools />
      </div>
    ,
    dest
  );
}
