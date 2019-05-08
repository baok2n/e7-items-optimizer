import React from 'react';
import { connect } from 'react-redux';
import './HeroStatsView.scss';

const HeroStatsView = ({heroStats}) => {
  const _renderStatTableRow = (title, base, gear) => (
    <tr>
      <th>{title}</th>
      <td>{base}</td>
      <td>{gear}</td>
      <td>{base + gear}</td>
    </tr>
  )
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
          {_renderStatTableRow('Attack', 900, 2000)}
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
