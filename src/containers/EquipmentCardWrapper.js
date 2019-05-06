import React from 'react';
import { isEmpty } from 'lodash';
import EquipmentCard from '../components/EquipmentCard';

const EquipmentCardWrapper = ({data}) => {
  if (isEmpty(data)) {
    return null;
  }

  return (
    <div cards-wrapper>
      <EquipmentCard
        data={data}
        equipmentType="Weapon"
      />
    </div>
  )
};

export default EquipmentCardWrapper;