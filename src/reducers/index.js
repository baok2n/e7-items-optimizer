import { combineReducers } from 'redux';
import data from './e7Reducer';
import gearData from './gearOnHeroesReducer';

export default combineReducers({
  data,
  gearData
});
