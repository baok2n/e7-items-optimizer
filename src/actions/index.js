import {
  GET_HERO_STATS_LOADING,
  GET_HERO_STATS_SUCCESS,
  FETCH_E7_DATA,
  REQUEST_BODY_TEMPLATE,
  SET_HERO_GEAR,
  UPDATE_HERO_GEAR,
} from './types';
import axios from 'axios';
import { forEach, includes } from 'lodash';
import { getApiStatString } from '../utils';

const apiUrl = 'https://epicseven-tools-api.herokuapp.com/heroes';

export const fetchData = (data) => {
  return {
    type: FETCH_E7_DATA,
    data
  }
};

export const fetchGithubData = () => {
  return (dispatch) => {
    return axios.get(apiUrl)
      .then(response => {
        dispatch(fetchData(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const getStats = (data) => {
  return {
    type: GET_HERO_STATS_SUCCESS,
    data
  }
};

const buildRequestBody = (equipedItems) => {
  const requestBody = Object.assign({}, REQUEST_BODY_TEMPLATE);
  forEach(equipedItems, item => {
    const stats = {};
    let slot = item.slot.toLowerCase();
    if (slot === 'armor') {
      slot = 'armour';
    }
    requestBody[slot] = {};
    // collect main stat
    const mainStatName = getApiStatString(item.mainStat[0].toLowerCase());
    const mainStatValue = includes(['chc', 'chd', 'atk%', 'hp%'], mainStatName) ? item.mainStat[1] / 100 : item.mainStat[1];
    stats[mainStatName] = mainStatValue;
    // collect substats
    forEach(Object.keys(item.subStats), subStat => {
      const subStatName = getApiStatString(subStat.toLowerCase());
      const subStatValue = includes(['chc', 'chd', 'atk%', 'hp%'], subStatName) ? item.subStats[subStat] / 100 : item.subStats[subStat];
      stats[subStatName] = subStatValue;
    });
    // collect item set
    requestBody[slot].set = item.set;
    // apply stats to requestBody
    requestBody[slot].stats = stats; 
  });

  return requestBody;
}

export const getHeroStats = (heroName, equipedItems) => {
  return (dispatch) => {
    dispatch({ type: GET_HERO_STATS_LOADING });
    const requestBody = buildRequestBody(equipedItems);
    return axios.post(`${apiUrl}/${heroName}/equip`, requestBody)
      .then(response => {
        dispatch(getStats(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const setHeroGear = (heroId, gear) => {
  return (dispatch) => {
    return (
      dispatch({
        type: SET_HERO_GEAR,
        heroId,
        gear
      })
    )
  }
}

export const updateHeroGear = gear => {
  return (dispatch) => {
    return (
      dispatch({
        type: UPDATE_HERO_GEAR,
        gear
      })
    )
  }
}
