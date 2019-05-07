import React, {Component} from "react";
import { isEmpty, map, find } from 'lodash';
import EquipmentCard from '../components/EquipmentCard';

class EquipmentCardWrapper extends Component {
  _getEquipedItems = () => {
    if (isEmpty(this.props.heroData)) {
      return null;
    }

    const { equipment } = this.props.heroData[0];
    return map(Object.keys(equipment), item => {
      const itemId = equipment[item];
      return find(this.props.itemData, i => {
        return i.id === itemId;
      });
    });
  }

  _getItemData = (items, itemSlot) => (
    find(items, item => (
      item.slot === itemSlot
    ))
  )

  render() {
    const items = this._getEquipedItems();
    return (
      <div className="cards-wrapper">
        <EquipmentCard
          data={this._getItemData(items, 'Weapon')}
          slot='Weapon'
        />
        <EquipmentCard
          data={this._getItemData(items, 'Helmet')}
          slot='Helmet'
        />
        <EquipmentCard
          data={this._getItemData(items, 'Armor')}
          slot='Armor'
        />
        <EquipmentCard
          data={this._getItemData(items, 'Necklace')}
          slot='Necklace'
        />
        <EquipmentCard
          data={this._getItemData(items, 'Ring')}
          slot='Ring'
        />
        <EquipmentCard
          data={this._getItemData(items, 'Boot')}
          slot='Boot'
        />
      </div>
    )
  }
};

export default EquipmentCardWrapper;