import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import E7App from './containers/E7App';
import rootReducer from './reducers';
import './App.css';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(thunk)),
);
  

ReactDOM.render(
  <Provider store={store}>
    <E7App />
  </Provider>, document.getElementById('root')
);
