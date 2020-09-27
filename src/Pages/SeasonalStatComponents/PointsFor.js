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

  getChartColors(pointsForData) {
    let backgroundColors = {};
    let colorCopy = [...colors];
    if (this.state.viewType === "weekbyweek") {
      for (let i = 0; i < pointsForData[0].data.length; i++) {
        if (!backgroundColors[pointsForData[0].data[i].managerGUID]) {
          let indexToRemove = this.getRandomInt(colorCopy.length - 1);
          let color = colorCopy[indexToRemove];
          colorCopy = _.remove(colorCopy, function (x, y) {
            return y !== indexToRemove;
          });
          backgroundColors[pointsForData[0].data[i].managerGUID] = color;
        }
      }
    } else {
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
    }

    return backgroundColors;
  }

  getChartLabels(pointsForData) {
    let labels = [];
    if (this.state.viewType === "topweeks") {
      for (let i = 0; i < this.state.maxNumManagers; i++) {
        labels.push(JSON.stringify(pointsForData[i]));
      }
    } else if (this.state.viewType === "seasontotal") {
      for (let i = 0; i < pointsForData.length; i++) {
        labels.push(JSON.stringify(pointsForData[i]));
      }
    } else {
      for (let i = 0; i < 16; i++) {
        labels.push(`week ${i + 1}`);
      }
    }
    return labels;
  }

  getChartDatasets(pointsForData, backgroundColors) {
    let datasets = [];
    if (this.state.viewType !== "weekbyweek") {
      datasets = [
        {
          label: "Points Scored",
          data: pointsForData.map((x) => x.pointsScored),
          backgroundColor: pointsForData.map(
            (x) => backgroundColors[x.managerGUID]
          ),
        },
      ];
    } else {
      // need to change to use managerGUID instead of manager name for comparisons.
      let managers = pointsForData[0].data.map((x) => ({
        managerGUID: x.managerGUID,
        managerName: x.managerName,
      }));
      let dataPoints = [];
      for (let i = 0; i < managers.length; i++) {
        for (let k = 0; k < pointsForData.length; k++) {
          if (!dataPoints.find((x) => x.label === managers[i].managerName)) {
            dataPoints.push({
              type: "bar",
              label: managers[i].managerName,
              data: [
                pointsForData[k].data.find(
                  (x) => x.managerName === managers[i].managerName
                ).pointsScored,
              ],
              backgroundColor: backgroundColors[managers[i].managerGUID],
            });
          } else {
            let pointsScored = pointsForData[k].data.find(
              (x) => x.managerName === managers[i].managerName
            )?.pointsScored;
            if (pointsScored) {
              dataPoints
                .find((x) => x.label === managers[i].managerName)
                .data.push(pointsScored);
            } else {
              dataPoints
                .find((x) => x.label === managers[i].managerName)
                .data.push(0);
            }
          }
        }
      }
      datasets = dataPoints;
    }
    return datasets;
  }

  onChangeSelectButton(e) {
    if(e.value) {
      this.setState({ sortBy: e.value }) 
    }   
  }

  getChartTitle() {
    if(this.state.viewType === "weekbyweek") {
      return "Top Points Scored (Week by week)"
    }
    else if(this.state.viewType === "seasontotal") {
      return "Top Points Scored (Season total)"
    }
    else if(this.state.viewType === "topweeks") {    
      return "Top Points Scored (Best weeks all season)"
    }
  }

  render() {
    let pointsForData = GetTopPointsFor(
      this.state.viewType,
      this.state.maxNumManagers,
      this.state.sortBy,
      this.props.stats
    );

    if (this.state.viewType === "weekbyweek") {
      for (let i = 0; i < pointsForData.length; i++) {
        pointsForData[i].data = pointsForData[i].data.sort((x, y) =>
          x.pointsScored < y.pointsScored ? 1 : -1
        );
      }
    }

    let labels = this.getChartLabels(pointsForData);

    let backgroundColors = this.getChartColors(pointsForData);

    let chartDatasets = this.getChartDatasets(pointsForData, backgroundColors);

    let chartData = {
      labels: labels,
      datasets: chartDatasets,
    };

    let basicOptions = {
      tooltips: {
        callbacks: {
          title: function (tooltipItem, data) {
            return "";
          },
        },
      },
      maintainAspectRation: false,
      title: {
        display: true,
        text: this.getChartTitle(),
        fontSize: 16,
      },
      legend: {
        display: this.state.viewType === "weekbyweek" ? true : false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "#495057",

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

    

    let singleWeekFilterControls = this.getSingleWeekControls();
    
    basicOptions = this.setChartOptionsOffViewType(basicOptions);

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
            onChange={(e) => {
              let sortBy = this.state.sortBy;
              if (e.value === "seasontotal") {
                sortBy = "asc";
              }
              if(e.value){
                this.setState({ viewType: e.value, sortBy });

              }
            }}
            style={{ padding: 20 }}
          />
          {singleWeekFilterControls}
          <Chart type="bar" data={chartData} options={basicOptions} />
        </div>
      </div>
    );
  }

  getSingleWeekControls() {
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
            onChange={(e) => this.onChangeSelectButton(e)}
            style={{ padding: 20 }}
          />
        </div>
      );
    }
    return singleWeekFilterControls;
  }

  setChartOptionsOffViewType(basicOptions) {
    if (this.state.viewType !== "weekbyweek") {
      basicOptions.tooltips.label = function (tooltipItem, data) {
        var label = data.datasets[tooltipItem.datasetIndex].label || "";
        let item = JSON.parse(tooltipItem.label);
        return [`Points Scored: ${item.pointsScored}`];
      };

      basicOptions.tooltips.afterBody = function (tooltipItem, data) {
        let item = JSON.parse(tooltipItem[0].label);
        let bodyItems = [];
        bodyItems.push(`\t\t\t Manager: ${item.managerName}`);
        if (item.week !== "-1") {
          bodyItems.push(`\t\t\t Week: ${item.week}`);
        }
        return bodyItems;
      };
      basicOptions.scales.xAxes[0].ticks.callback = function (value, index, values) {
        let item = null;
        item = JSON.parse(value);
        return `${index + 1} - ${item.managerName}`;
      };
    } else {
      basicOptions.scales.xAxes[0].stacked = true;
      basicOptions.scales.yAxes[0].stacked = true;
      basicOptions.tooltips.mode = "index";
      basicOptions.intersect = false;
    }
    return basicOptions;
  }
}
export default PointsFor;
