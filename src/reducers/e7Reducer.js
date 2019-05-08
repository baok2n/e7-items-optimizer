import { GET_HERO_STATS } from '../actions/types';

export default function e7Reducer(state = [], action) {
  switch (action.type) {
    case GET_HERO_STATS:
      return action.data;
    default:
      return state;
  }
}
