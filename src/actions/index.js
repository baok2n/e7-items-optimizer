import { GET_HERO_STATS, FETCH_E7_DATA, REQUEST_BODY_TEMPLATE } from './types';
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
    type: GET_HERO_STATS,
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
    const mainStatValue = includes(['chc', 'chd', 'atk%'], mainStatName) ? item.mainStat[1] / 100 : item.mainStat[1];
    stats[mainStatName] = mainStatValue;
    // collect substats
    forEach(Object.keys(item.subStats), subStat => {
      const subStatName = getApiStatString(subStat.toLowerCase());
      const subStatValue = includes(['chc', 'chd', 'atk%'], subStatName) ? item.subStats[subStat] / 100 : item.subStats[subStat];
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
  const requestBody = buildRequestBody(equipedItems);
  return (dispatch) => {
    return axios.post(`${apiUrl}/${heroName}/equip`, requestBody)
      .then(response => {
        dispatch(getStats(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};