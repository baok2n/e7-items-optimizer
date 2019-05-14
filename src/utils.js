import { includes } from 'lodash';

const API_STATS_LOOKUP = {
  hpp: 'hp%',
  atkp: 'atk%',
  defp: 'def%',
  cchance: 'chc',
  cdmg: 'chd',
  res: 'efr',
}

const percentageStats = ['HPP', 'AtkP', 'CChance', 'Eff', 'CDmg', 'Res', 'DefP'];

export const getApiStatString = (stat) => (
  API_STATS_LOOKUP[stat] || stat
)

export const getDisplayStatValueFormat = (key, value) => (
  includes(percentageStats, key) ?
    `${value}%` : value
);