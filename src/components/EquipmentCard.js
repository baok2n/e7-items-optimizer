import React from "react";
import { isEmpty } from 'lodash';
import './EquipmentCard.scss';
import { getDisplayStatValueFormat } from '../utils';

const EquipmentCard = ({data = {}, slot}) => {
  const {
    rarity = '',
    level = 0,
    ability = 0,
    mainStat = ['???', '???'],
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
        <div className="value">{getDisplayStatValueFormat(subStat[0], subStat[1])}</div>
      </div>
    );
  };
  return (
    <div className="card-wrapper">
      <div className="title">
        <i className={`slot-icon ${slot}`} />
        &nbsp;{`${rarity} ${slot}`}&nbsp;
        <span className="level">{level}</span>
        <span className="ability">+{ability}</span>
      </div>
      <div className="separator" />
      <div className="main-stat">
        <div className="key">{mainStat[0]}</div>
        <div className="value">{getDisplayStatValueFormat(mainStat[0], mainStat[1])}</div>
      </div>
      <div className="separator" />
      <div className="substats-wrapper">
        {_renderSubStats(subStat1)}
        {_renderSubStats(subStat2)}
        {_renderSubStats(subStat3)}
        {_renderSubStats(subStat4)}
      </div>
      <div className="separator" />

      <div>{`${set} Set`}</div>
      <div className="separator" />
      <div>Location: </div>
      <span className="equip-btn">equip</span>
    </div>
  )
}

export default EquipmentCard;