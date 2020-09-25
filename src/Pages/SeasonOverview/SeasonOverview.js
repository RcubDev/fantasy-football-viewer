import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { PanelMenu } from "primereact/panelmenu";
import PointsFor from "../SeasonalStatComponents/PointsFor";
import weeklyScoreboards from "../../data/league/WeeklyScoreboard"


class SeasonOverview extends React.Component {
  constructor(props) {
    super();
    this.state = {
      statViewType: "none",
    };
  }

  setStatView(viewType) {
    this.setState({
      ...this.state,
      statViewType: viewType,      
    });
  }
  
  items = [
    {
      label: "Top 10",
      icon: "pi pi-fw pi-file",
      items: [
        {
          //should be able to have high low options AND options for weekly + season options
          label: "Points For",
          command: () => {this.setStatView("PointsFor")},
          icon: "pi pi-fw",
        },
        {
          //should be able to have high low options AND options for weekly + season options
          label: "Points Against",
          command: () => {this.setStatView("PointsAgainst")},
          icon: "pi pi-fw",
        },
        {
          //should be able to have high low options AND options for weekly + season options
          label: "Points On Bench",
          command: () => {this.setStatView("Bench")},
          icon: "pi pi-fw",
        },
      ],
    },
    {
      label: "# of",
      icon: "pi pi-fw pi-pencil",
      items: [
        {
          label: "Wins",
          icon: "pi pi-fw",
          command: () => {this.setStatView("wins")},
        },
        {
          label: "Losses",
          icon: "pi pi-fw",
          command: () => {this.setStatView("losses")},
        },
        {
          label: "Transactions",
          icon: "pi pi-fw",
          command: () => {this.setStatView("transactions")},
        },
        {
          label: "Trades",
          icon: "pi pi-fw",
          command: () => {this.setStatView("PointsFor")},
        },
      ],
    },
  ];

  render() {
    let StatComponent =  this.GetStatComponent(this.state.statViewType);
    return (
      <div style={{display: "flex"}}>
        <PanelMenu model={this.items} style={{ width: "300px" }} />
        {StatComponent}
      </div>
    );
  }

  GetStatComponent(statViewType) {
    let seasonLeagueId = this.props.match.params.seasonId;
    switch(statViewType.toLowerCase()) {
        case "pointsfor":
            let weeksToEvaluate = weeklyScoreboards;
            
            if(this.props.match.params.seasonId !== "All"){
                weeksToEvaluate = weeksToEvaluate.filter(x => x.leagueId === seasonLeagueId);
            }            
            return (<PointsFor stats={weeksToEvaluate}></PointsFor>)
        case "none":
            return (<div></div>);
    }
  }
}

export default withRouter(SeasonOverview);
