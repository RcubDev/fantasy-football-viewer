import React from "react";
import { GetTopPointsFor } from "../../Helpers/SeasonStatHelper";
import { Chart } from "primereact/chart";
import colors from "../../Constants/ChartColors";
import _ from "lodash";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

class PointsFor extends React.Component {
  constructor(props) {
    super();
    this.state = {
      viewType: "seasontotal",
      sortBy: "asc", //desc
      maxNumManagers: 15,
    };
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  sortOptions = [
    { name: "ASC", code: "asc" },
    { name: "DESC", code: "desc" },
  ];

  viewOptions = [
    { name: "Season total", code: "seasontotal" },
    { name: "Week by week", code: "weekbyweek" },
    { name: "Top weeks", code: "topweeks" },
  ];

  render() {
    let pointsForData = GetTopPointsFor(
      this.state.viewType,
      this.state.maxNumManagers,
      this.state.sortBy,
      this.props.stats
    );

    let labels = [];
    if (this.state.viewType === "topweeks") {
      for (let i = 0; i < this.state.maxNumManagers; i++) {
        labels.push(JSON.stringify(pointsForData[i]));
        // labels.push(`#${i + 1} - ${pointsForData[i].managerName}`);
      }
    } else {
      for (let i = 0; i < pointsForData.length; i++) {
        labels.push(JSON.stringify(pointsForData[i]));
      }
    }

    let colorCopy = [...colors];
    let backgroundColors = {};
    for (let i = 0; i < pointsForData.length; i++) {
      if (!backgroundColors[pointsForData[i].managerGUID]) {
        let indexToRemove = this.getRandomInt(colorCopy.length - 1);
        let color = colorCopy[indexToRemove];
        colorCopy = _.remove(colorCopy, function (x, y) {
          return y !== indexToRemove;
        });
        backgroundColors[pointsForData[i].managerGUID] = color;
      }
    }

    let chartData = {
      labels: labels,
      datasets: [
        {
          label: "Points Scored",
          data: pointsForData.map((x) => x.pointsScored),
          backgroundColor: pointsForData.map(
            (x) => backgroundColors[x.managerGUID]
          ),
        },
      ],
    };

    let basicOptions = {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            console.log(tooltipItem);
            var label = data.datasets[tooltipItem.datasetIndex].label || "";
            let item = JSON.parse(tooltipItem.label);
            console.log(item);
            return [
              `Points Scored: ${item.pointsScored}`,
            ];
          },
          afterBody: function (tooltipItem, data) {
            let item = JSON.parse(tooltipItem[0].label);
            console.log(item);
            let bodyItems = [];
            bodyItems.push(`\t\t\t Manager: ${item.managerName}`);
            if(item.week !== "-1") {
                bodyItems.push(`\t\t\t Week: ${item.week}`);
            }
            return bodyItems;
          },
          title: function(tooltipItem, data) {
              return "";
          }
        },
      },
      maintainAspectRation: false,
      title: {
        display: true,
        text: this.state.singleWeek
          ? "Top Points Scored (In a single week)"
          : "Top Points Scored (Season total)",
        fontSize: 16,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "#495057",
              callback: function (value, index, values) {
                let item = null;
                item = JSON.parse(value);
                return `${index + 1} - ${item.managerName}`;
              },
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "#495057",
            },
          },
        ],
      },
    };

    let singleWeekFilterControls = [];
    if (this.state.viewType === "topweeks") {
      singleWeekFilterControls = (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span className="p-float-label" style={{ margin: 20 }}>
            <InputNumber
              onValueChange={(e) => this.setState({ maxNumManagers: e.value })}
              value={this.state.maxNumManagers}
            ></InputNumber>
            <label htmlFor="managerCount"># of weeks</label>
          </span>

          <SelectButton
            optionLabel="name"
            optionValue="code"
            options={this.sortOptions}
            value={this.state.sortBy}
            onChange={(e) => this.setState({ sortBy: e.value })}
            style={{ padding: 20 }}
          />
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            minWidth: 1000,
            display: "flex",
            flexDirection: "column",
            minHeight: 500,
            textAlign: "center",
          }}
        >
          <SelectButton
            optionLabel="name"
            optionValue="code"
            options={this.viewOptions}
            value={this.state.viewType}
            onChange={
                (e) => {
                    let sortBy = this.state.sortBy;
                    if(e.value === "seasontotal") {
                        sortBy = "asc";
                    }
                    this.setState({ viewType: e.value, sortBy });
                }
            }
            style={{ padding: 20 }}
          />
          {singleWeekFilterControls}
          <Chart type="bar" data={chartData} options={basicOptions} />
        </div>
      </div>
    );
  }
}
export default PointsFor;
