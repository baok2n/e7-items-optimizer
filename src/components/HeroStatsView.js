import React from 'react';
import { connect } from 'react-redux';
import { map, get } from 'lodash';
import { HERO_STATS } from './types';
import './HeroStatsView.scss';

const HeroStatsView = ({heroStats}) => {
  const _renderStatTableRow = (statName, base, gear) => {
    console.log('base', statName, base, gear);
    return (<tr key={statName}>
      <th>{statName}</th>
      <td>{base}</td>
      <td>{gear}</td>
      <td>{base + gear}</td>
    </tr>);
  }

  const _renderStats = () => {
    console.log('sadasd', heroStats);
    return map(Object.keys(HERO_STATS), statKey => (
      _renderStatTableRow(HERO_STATS[statKey], 0, get(heroStats, `stats[${statKey}]`, 0))
    ));
  };
  
  return (
    <div className="hero-stats-view-wrapper">
      <div className="header">
        <span className="hero-name">Luna</span>
      </div>
      <table className="hero-stats-table">
        <thead>
          <tr>
            <th />
            <th>Base</th>
            <th>Gear</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {_renderStats()}
        </tbody>
      </table>
    </div>
  )
};

const mapStateToProp = state => {
  return {
    heroStats: state.data
  }
}

export default connect(mapStateToProp)(HeroStatsView);
