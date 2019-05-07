import { FETCH_E7_DATA } from '../actions/types';

export default function e7Reducer(state = [], action) {
  switch (action.type) {
    case FETCH_E7_DATA:
      return action.data;
    default:
      return state;
  }
}
