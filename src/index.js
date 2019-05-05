import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import EquipmentTable from './containers/EquipmentTable';
import rootReducer from './reducers';
import { fetchGithubData } from './actions/index';
import './App.css';

const store = createStore(rootReducer, applyMiddleware(thunk));

store.dispatch(fetchGithubData());

ReactDOM.render(
  <Provider store={store}>
    <EquipmentTable />
  </Provider>, document.getElementById('root'));
