import { GET_HERO_STATS_LOADING, GET_HERO_STATS_SUCCESS } from '../actions/types';

export default function e7Reducer(state = [], action) {
  switch (action.type) {
    case GET_HERO_STATS_LOADING:
      return {...state, isLoading: true};
    case GET_HERO_STATS_SUCCESS:
      return {...state, ...action.data, isLoading: false};
    default:
      return state;
  }
}
