import React, {Component} from "react";
import { cloneDeep } from 'lodash';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class EquipmentTable extends Component {
  state = {
    data: [],
  };

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
    return convertedData;
  }

  _handleImport = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      const content = JSON.parse(fileReader.result);
      this.setState({ data: content.items });
    }
    fileReader.readAsText(file);
  }

  render () {
    const { data = [] } = this.state;
    const tableData = this._getTableData(data);
    console.log(tableData);
    return (
      <div>
        <div>
          <input
            type="file"
            accept="*.json"
            onChange={e => this._handleImport(e.target.files[0])}
          />
        </div>
        <br />
        <ReactTable
            data={tableData}
            filterable
            showPaginationTop
            showPaginationBottom={false}
            columns={[
              {
                columns: [
                  {
                    Header: "Set",
                    accessor: "set",
                    minWidth: 75,
                  },
                  {
                    Header: "Rarity",
                    accessor: "rarity",
                    minWidth: 60,
                  },
                  {
                    Header: "Slot",
                    accessor: "slot",
                    minWidth: 60,
                  },
                  {
                    Header: "Level",
                    accessor: "level",
                    minWidth: 60,
                  },
                  {
                    Header: "Ablt",
                    accessor: "ability",
                    minWidth: 60,
                  },
                ]
              },
              {
                Header: "Main",
                columns: [
                  {
                    Header: "Stat",
                    id: 'mainStatName',
                    accessor: d => d.mainStat[0]
                  },
                  {
                    Header: "Value",
                    id: 'mainStatValue',
                    accessor: d => d.mainStat[1]
                  },
                ]
              },
              {
                Header: "Sub",
                columns: [
                  {
                    Header: "HP%",
                    id: 'hpp',
                    accessor: d => d.subStats['HPP'],
                    minWidth: 60,
                  },
                  {
                    Header: "HP",
                    id: 'hp',
                    accessor: d => d.subStats['HP'],
                    minWidth: 60,
                  },
                  {
                    Header: "Atk%",
                    id: 'atkp',
                    accessor: d => d.subStats['AtkP'],
                    minWidth: 60,
                  },
                  {
                    Header: "Atk",
                    id: 'atk',
                    accessor: d => d.subStats['Atk'],
                    minWidth: 60,
                  },
                  {
                    Header: "Def%",
                    id: 'defp',
                    accessor: d => d.subStats['DefP'],
                    minWidth: 60,
                  },
                  {
                    Header: "Def",
                    id: 'def',
                    accessor: d => d.subStats['DefP'],
                    minWidth: 60,
                  },
                  {
                    Header: "Spd",
                    id: 'spd',
                    accessor: d => d.subStats['Spd'],
                    minWidth: 60,
                  },
                  {
                    Header: "CDmg",
                    id: 'cdmg',
                    accessor: d => d.subStats['CDmg'],
                    minWidth: 60,
                  },
                  {
                    Header: "Eff",
                    id: 'eff',
                    accessor: d => d.subStats['Eff'],
                    minWidth: 60,
                  },
                  {
                    Header: "Res",
                    id: 'res',
                    accessor: d => d.subStats['Res'],
                    minWidth: 60,
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

export default EquipmentTable;