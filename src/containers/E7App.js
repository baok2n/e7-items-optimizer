import React, {Component} from "react";
import { connect } from 'react-redux';

import { cloneDeep, get, set, isEmpty, map, find } from 'lodash';

import { saveAs } from 'file-saver';
import Select from "react-dropdown-select";

import EquipmentCardWrapper from './EquipmentCardWrapper';
import HeroStatsView from '../components/HeroStatsView';
import { getHeroStats, setHeroGear, updateHeroGear } from '../actions';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class E7App extends Component {
  state = {
    itemData: [],
    heroData: [],
    selectedHeroData: {},
    selectedHeroName: '',
  };
  fullData = [];

  // Convert item substats 1, 2, 3, 4 to stand alone stats
  // to be displayed in table
  _getTableData = (data) => {
    let convertedData = cloneDeep(data);
    for (let n = 0; n < data.length; n++) {
      convertedData[n]['subStats'] = {};
      for (let i = 1; i < 5; i++) {
        const subStat = data[n][`subStat${i}`];
        if (subStat) {
          convertedData[n]['subStats'][subStat[0]] = subStat[1];
        }
      }
    }
    this.fullData = {...this.fullData, items: convertedData};
    return convertedData;
  }

  _getDataToExport = () => {
    const items = this.fullData.items.map(item => {
      for(let i = 0; i < Object.keys(item.subStats).length; i++) {
        item[`subStat${i+1}`] = [ Object.keys(item.subStats)[i], Object.values(item.subStats)[i] ];
      }
      return item;
    });

    return { ...this.fullData, items };
  }

  _handleImport = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = JSON.parse(fileReader.result);
      this.fullData = content;
      this.setState({
        itemData: this._getTableData(content.items),
        heroData: content.heroes,
      });
    }
    fileReader.readAsText(file);
  }

  _handleExport = () => {
    var text = JSON.stringify(this._getDataToExport(this.fullData));
    var filename = `${new Date()}.json`;
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  }

  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const itemData = [...this.state.itemData];
          set(itemData, `${cellInfo.index}.${cellInfo.column.id}`, e.target.innerHTML);
          this.setState({ itemData });
        }}
        dangerouslySetInnerHTML={{
          __html: get(this.state.itemData, `${cellInfo.index}.${cellInfo.column.id}`)
        }}
      />
    );
  }

  _getEquipedItems = (selectedHeroData) => {
    if (isEmpty(selectedHeroData)) {
      return null;
    }

    const { equipment } = selectedHeroData[0];
    return map(Object.keys(equipment), item => {
      const itemId = equipment[item];
      return find(this.state.itemData, i => {
        return i.id === itemId;
      });
    });
  }

  _updateEquipedItems = (rowInfo) => {
    if (!rowInfo) {
      return null;
    }
    const selectedItem = rowInfo.original;
    const newEquipedItems = map(this.props.gearData.gear, item => {
      if (item.slot === selectedItem.slot) {
        return selectedItem;
      }
      return item;
    });
    this.props.updateHeroGear(newEquipedItems);
    this.props.getHeroStats(this.state.selectedHeroName, newEquipedItems);
  }

  _handleSelectHero = data => {
    const equipedItems = this._getEquipedItems(data);
    const selectedHero = get(data, `[0].baseHeroId`);
    const heroId = get(data, '[0].id');
    // send data to API to get stats review
    this.props.getHeroStats(selectedHero, equipedItems);
    this.props.setHeroGear(heroId, equipedItems);
    this.setState({
      selectedHeroData: data,
      selectedHeroName: selectedHero,
    });
  }

  render () {
    const { itemData = [], heroData = [] } = this.state;
    return (
      <div>
        <div className="stats-review">
          <EquipmentCardWrapper
            data={this.props.gearData.gear}
          />
          <HeroStatsView
            heroName={this.state.selectedHeroName}
          />
        </div>
        <br />
        <ReactTable
            data={itemData}
            filterable
            showPaginationTop
            showPaginationBottom={false}
            getTdProps={(_, rowInfo, undefined, instance) => {
              return {
                onDoubleClick: () => {
                  this._updateEquipedItems(rowInfo);
                }
              }
            }}
            columns={[
              {
                Header: 'Action',
                columns: [
                  {
                    minWidth: 65,
                    Cell: <div className="review">Review</div>
                  }
                ]
              },
              {
                columns: [
                  {
                    Header: "Set",
                    accessor: "set",
                    minWidth: 75,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Rarity",
                    accessor: "rarity",
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Slot",
                    accessor: "slot",
                    minWidth: 80,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Level",
                    accessor: "level",
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Ablt",
                    accessor: "ability",
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                ]
              },
              {
                Header: "Main",
                columns: [
                  {
                    Header: "Stat",
                    id: 'mainStat[0]',
                    accessor: d => d.mainStat[0],
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Value",
                    id: 'mainStat[1]',
                    accessor: d => d.mainStat[1],
                    Cell: this.renderEditable,
                  },
                ]
              },
              {
                Header: "Sub",
                columns: [
                  {
                    Header: "HP%",
                    id: 'subStats[HPP]',
                    accessor: d => d.subStats['HPP'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "HP",
                    id: 'subStats[HP]',
                    accessor: d => d.subStats['HP'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Atk%",
                    id: 'subStats[AtkP]',
                    accessor: d => d.subStats['AtkP'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Atk",
                    id: 'subStats[Atk]',
                    accessor: d => d.subStats['Atk'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Def%",
                    id: 'subStats[DefP]',
                    accessor: d => d.subStats['DefP'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Def",
                    id: 'subStats[Def]',
                    accessor: d => d.subStats['Def'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Spd",
                    id: 'subStats[Spd]',
                    accessor: d => d.subStats['Spd'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "CChance",
                    id: 'subStats[CChance]',
                    accessor: d => d.subStats['CChance'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "CDmg",
                    id: 'subStats[CDmg]',
                    accessor: d => d.subStats['CDmg'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Eff",
                    id: 'subStats[Eff]',
                    accessor: d => d.subStats['Eff'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                  {
                    Header: "Res",
                    id: 'subStats[Res]',
                    accessor: d => d.subStats['Res'],
                    minWidth: 60,
                    Cell: this.renderEditable,
                  },
                ]
              },
            ]}
            // pivotBy={["firstName", "lastName"]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        <div>
          <input
            type="file"
            accept="*.json"
            onChange={e => this._handleImport(e.target.files[0])}
          />
          <button
            className="btn btn-danger"
            onClick={this._handleExport}
          >
            Export
          </button>
        </div>
        <Select
          options={heroData}
          onChange={this._handleSelectHero}
          labelField="name"
          valueField="id"
          style={{ width: '20%' }}
        />
      </div>
    );
  }
};

const mapStateToProp = state => {
  return {
    gearData: state.gearData
  }
}

const mapDispatchToProps = () => dispatch => {
  return {
    getHeroStats: (heroName, equipedItems) => dispatch(getHeroStats(heroName, equipedItems)),
    setHeroGear: (heroId, gear) => dispatch(setHeroGear(heroId, gear)),
    updateHeroGear: gear => dispatch(updateHeroGear(gear)),
  }
}

export default connect(mapStateToProp, mapDispatchToProps)(E7App);
