import { GET_HERO_STATS, FETCH_E7_DATA, REQUEST_BODY_TEMPLATE } from './types';
import axios from 'axios';
import { forEach } from 'lodash';

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
    const slot = item.slot.toLowerCase();
    const stats = {};
    // collect main stat
    stats[item.mainStat[0].toLowerCase] = item.mainStat[1];
    // collect substats
    forEach(Object.keys(item.subStats), subStat => {
      stats[item.subStats[item.subStats]] = item.mainStat[1];
    })
  })
  return {};
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