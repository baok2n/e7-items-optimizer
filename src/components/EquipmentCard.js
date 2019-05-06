import React from "react";
import './EquipmentCard.scss';

const EquipmentCard = () => {
  return (
    <div className="card-wrapper">
      <div className="title">
        <i className="slot-icon weapon" />
        &nbsp;Epic weapon&nbsp;
        <span className="level">85</span>
      </div>

      <div className="separator" />
      <div className="main-stat">
        <div className="key">Attack</div>
        <div className="value">300</div>
      </div>
      <div className="separator" />
      <div className="sub-stat">
        <div className="key">Attack</div>
        <div className="value">15%</div>
      </div>
      <div className="sub-stat">
        <div className="key">Speed</div>
        <div className="value">10</div>
      </div>
      <div className="sub-stat">
        <div className="key">Crit chance</div>
        <div className="value">10</div>
      </div>
      <div className="sub-stat">
        <div className="key">Hp</div>
        <div className="value">10%</div>
      </div>
      <div className="separator" />

      <div>Lifesteal set</div>
      <div className="separator" />
      <div>Location: Sez1</div>
    </div>
  )
}

export default EquipmentCard;