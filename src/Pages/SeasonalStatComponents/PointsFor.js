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
      singleWeek: false,
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
    { name: "Season long", code: false },
    { name: "Week by week", code: true },
  ];

  render() {
    let pointsForData = GetTopPointsFor(
      this.state.singleWeek,
      this.state.maxNumManagers,
      this.state.sortBy,
      this.props.stats
    );

    let labels = [];
    if (this.state.singleWeek) {
      for (let i = 0; i < this.state.maxNumManagers; i++) {
        labels.push(`#${i + 1} - ${pointsForData[i].managerName}`);
      }
    } else {
      for (let i = 0; i < pointsForData.length; i++) {
        labels.push(`${i + 1} - ${pointsForData[i].managerName}`);
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
      maintainAspectRation: false,
      title: {
        display: true,
        text: this.state.singleWeek
          ? "Top Points Scored (In a single week)"
          : "Top Points For (Season total)",
        fontSize: 16,
      },
      legend: {
        labels: {
          fontColor: "#495057",
        },
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
      }
    };

    let singleWeekFilterControls = [];
    if (this.state.singleWeek) {
      singleWeekFilterControls = (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span className="p-float-label" style={{ margin: 20 }}>        
          <InputNumber onValueChange={(e) => this.setState({maxNumManagers: e.value})} value={this.state.maxNumManagers}></InputNumber>

            {/* <InputText
              id="managerCount"
              value={this.state.maxNumManagers}
              onChange={(e) =>
                this.setState({ maxNumManagers: e.target.value })
              }
            /> */}
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
            value={this.state.singleWeek}
            onChange={(e) => this.setState({ singleWeek: e.value })}
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
