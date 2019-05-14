import { GET_ALL_HEROES_GEARS,
  SET_HERO_GEAR, UPDATE_HERO_GEAR } from '../actions/types';

export default function gearOnHeroesReducer(state = {}, action) {
  switch (action.type) {
    case GET_ALL_HEROES_GEARS:
      return state;
    case SET_HERO_GEAR:
      if (!action.heroId) {
        return state;
      }
      return Object.assign({}, state, {currentHeroId: action.heroId}, {gear: action.gear});
    case UPDATE_HERO_GEAR:
    return Object.assign({}, state, {gear: action.gear});
    default:
      return state;
  }
}
