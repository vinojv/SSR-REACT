import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
import { match, RouterContext } from 'react-router';
import createHistory from 'react-router/lib/createMemoryHistory';
import getRoutes from './routes';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  
  const memoryHistory = createHistory(req.originalUrl);
  
  const history = memoryHistory;

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} />));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      /*
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};
        
        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component}/>));
      });

      */
      res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={React.createElement(RouterContext, renderProps)}/>));
      // res.status(200).send(ReactDOM.renderToString(React.createElement(RouterContext, renderProps)))

    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
