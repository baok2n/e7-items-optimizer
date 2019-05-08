import React from "react";
import { isEmpty } from 'lodash';
import './EquipmentCard.scss';

const EquipmentCard = ({data = {}, slot}) => {
  const {
    rarity = '',
    level = 0,
    mainStat = ['Attack', '???'],
    subStat1 = [],
    subStat2 = [],
    subStat3 = [],
    subStat4 = [],
    set = 'Item',
  } = data;

  const _renderSubStats = (subStat) => {
    if (isEmpty(subStat)) {
      return;
    }
    return (
      <div className="sub-stat">
        <div className="key">{subStat[0]}</div>
        <div className="value">{subStat[1]}</div>
      </div>
    );
  };
  return (
    <div className="card-wrapper">
      <div className="title">
        <i className={`slot-icon ${slot}`} />
        &nbsp;{`${rarity} ${slot}`}&nbsp;
        <span className="level">{level}</span>
      </div>
      <div className="separator" />
      <div className="main-stat">
        <div className="key">{mainStat[0]}</div>
        <div className="value">{mainStat[1]}</div>
      </div>
      <div className="separator" />
      {_renderSubStats(subStat1)}
      {_renderSubStats(subStat2)}
      {_renderSubStats(subStat3)}
      {_renderSubStats(subStat4)}
      <div className="separator" />

      <div>{`${set} Set`}</div>
      <div className="separator" />
      <div>Location: </div>
    </div>
  )
}

export default EquipmentCard;