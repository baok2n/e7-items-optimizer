import React, {Component} from "react";
import { connect } from 'react-redux';

import { cloneDeep, get, set, isEmpty, map, find } from 'lodash';

import { saveAs } from 'file-saver';
import Select from "react-dropdown-select";

import EquipmentCardWrapper from './EquipmentCardWrapper';
import HeroStatsView from '../components/HeroStatsView';
import { getHeroStats } from '../actions';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class E7App extends Component {
  state = {
    itemData: [],
    heroData: [],
    selectedHeroData: {},
    equipedItems: [],
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
          // data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
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
    const newEquipedItems = map(this.state.equipedItems, item => {
      if (item.slot === selectedItem.slot) {
        return selectedItem;
      }
      return item;
    });
    this.setState({ equipedItems: newEquipedItems });
  }

  _handleSelectHero = data => {
    this.props.getHeroStats('luna', { "stars": 5, "level": 50, "awakening": 0, "artifact": { "stats": {} }, "weapon": { "stats": { "atk": 100 }, "set": "attack" }, "helmet": { "stats": { "hp": 500 }, "set": "critical" }, "armour": { "stats": {}, "set": "" }, "necklace": { "stats": {}, "set": "" }, "ring": { "stats": {}, "set": "" }, "boots": { "stats": {}, "set": "" } });
    this.setState({
      selectedHeroData: data,
      equipedItems: this._getEquipedItems(data)
    });
  }

  render () {
    const { itemData = [], heroData = [] } = this.state;
    return (
      <div>
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
          onChange={(data) => {this._handleSelectHero(data)}}
          labelField="name"
          valueField="id"
          style={{width: '20%'}}
          />
        <div className="stats-review">
          <EquipmentCardWrapper
            data={this.state.equipedItems}
          />
          <HeroStatsView />
        </div>
        <br />
        <ReactTable
            data={itemData}
            filterable
            showPaginationTop
            showPaginationBottom={false}
            getTdProps={(_, rowInfo) => {
              return {
                onDoubleClick: () => {
                  this._updateEquipedItems(rowInfo);
                }
              }
            }}
            columns={[
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
      </div>
    );
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getHeroStats: (heroName, requestBody) => dispatch(getHeroStats(heroName, requestBody)),
  }
}

export default connect(null, mapDispatchToProps)(E7App);