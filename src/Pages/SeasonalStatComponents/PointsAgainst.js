import React from "react";
import { GetTopPointsFor } from "../../Helpers/SeasonStatHelper";
import { Chart } from "primereact/chart";
import colors from "../../Constants/ChartColors";
import _ from "lodash";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { GetTopPointsAgainst } from "../../Helpers/SeasonStatHelper";
import { getChartColors } from "../../Helpers/ChartColorHelper";

class PointsAgainst extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let pointsAgainstData = GetTopPointsAgainst(
      "",
      -1,
      "asc",
      this.props.stats
    );
    let labels = pointsAgainstData.map((x) => x.managerName);
    let managers = pointsAgainstData.map((x) => x.managerGUID);
    let backgroundColors = getChartColors(pointsAgainstData, managers);

    let chartData = {
      labels: labels,
      datasets: [{
        label: "Points Against",
        data: pointsAgainstData.map((x) => x.points),
        backgroundColor: pointsAgainstData.map(
          (x) => backgroundColors[x.managerGUID]
        ),
      }],
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
        text: "Points Against (Season)",
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

    return (
        <div
        style={{
          minWidth: 1000,
          display: "flex",
          flexDirection: "column",
          minHeight: 500,
          textAlign: "center",
        }}
      >
        <Chart type="bar" data={chartData} options={basicOptions} />
        Test
      </div>
    );
  }
}

export default PointsAgainst;
