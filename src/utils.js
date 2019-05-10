const API_STATS_LOOKUP = {
  hpp: 'hp%',
  atkp: 'atk%',
  defp: 'def%',
  cchance: 'chc',
  cdmg: 'chd',
  res: 'efr',
}

export const getApiStatString = (stat) => (
  API_STATS_LOOKUP[stat] || stat
)