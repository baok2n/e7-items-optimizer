import { GET_HERO_STATS, FETCH_E7_DATA } from './types';
import axios from 'axios';

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

export const getHeroStats = (heroName, requestBody) => {
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