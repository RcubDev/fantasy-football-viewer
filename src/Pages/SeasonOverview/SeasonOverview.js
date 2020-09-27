import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { Menu } from "primereact/menu";
import PointsFor from "../SeasonalStatComponents/PointsFor";
import weeklyScoreboards from "../../data/league/WeeklyScoreboard"
import leagueInfo from "../../data/league/LeagueInfoData";
import leagues from "../../data/league/LeaguesData";
import teams from "../../data/league/Teams";
import { Button } from "primereact/button";
import PointsAgainst from "../SeasonalStatComponents/PointsAgainst";



class SeasonOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statViewType: this.props?.match?.params?.view ? this.props?.match?.params?.view : "none",
      currentSeasonId: this.props.match.params.seasonId      
    };
  }

  

  CreateSeasons(internalLeagueId) {
    let seasonButtons = [];
    let leagueSeasons = leagues.filter(
      (y) => y.internalId === parseInt(internalLeagueId)
    );
    leagueSeasons = leagueSeasons.map((x) => x.id);
    let seasons = _.filter(leagueInfo, function (x) {
      return leagueSeasons.indexOf(x.league_id) > -1;
    });
    seasons.forEach((element) => {
      let result = (
        <div className="p-col" id={internalLeagueId + element.season + "pCol"}>
          <Button
            label={element.season}
            id={internalLeagueId + element.season + "Button"}
            onClick={() => {
              this.setState({currentSeasonId: element.league_id});
              let path = `/League/${internalLeagueId}/Seasons/${element.league_id}/View/${this.state.statViewType.toLowerCase()}`
              this.props.history.push(path)
            }}
          ></Button>
        </div>
      );
      seasonButtons.push(result);
    });
    return seasonButtons;
  }

  setStatView(viewType) {
    this.setState({
      ...this.state,
      statViewType: viewType,      
    });
  }
  
  items = [
    {
      label: "Stats",
      icon: "pi pi-fw pi-file",
      items: [
        {
          //should be able to have high low options AND options for weekly + season options
          label: "Points For",
          command: () => {this.setStatView("pointsfor")},
          icon: "pi pi-fw",
        },
        {
          //should be able to have high low options AND options for weekly + season options
          label: "Points Against",
          command: () => {this.setStatView("pointsagainst")},
          icon: "pi pi-fw",
        },
        {
          //should be able to have high low options AND options for weekly + season options
          label: "Points On Bench",
          command: () => {this.setStatView("bench")},
          icon: "pi pi-fw",
        },
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
          command: () => {this.setStatView("pointsfor")},
        },
      ],
    }    
  ];

  render() {
    let StatComponent =  this.GetStatComponent(this.state.statViewType);
    let id = this.props.match.params.internalLeagueId;
    return (
      <div style={{display: "flex"}}>
        <Menu model={this.items} style={{ width: "300px" }} />
        <div>
          <div style={{display: "flex", textAlign: "center"}}>
            {this.CreateSeasons(id)}
          </div>
          {StatComponent}
        </div>
      </div>
    );
  }

  GetStatComponent(statViewType) {
    let seasonLeagueId = this.state.currentSeasonId;
    let weeksToEvaluate = weeklyScoreboards;

    switch(statViewType.toLowerCase()) {
        case "pointsfor":
            //This is duplicated. Refactor.
            if(this.props.match.params.seasonId !== "All"){
                weeksToEvaluate = weeksToEvaluate.filter(x => x.leagueId === seasonLeagueId);
            }            

            return (<PointsFor stats={weeksToEvaluate}></PointsFor>)
        case "pointsagainst":          

          if(this.props.match.params.seasonId !== "All"){
              weeksToEvaluate = weeksToEvaluate.filter(x => x.leagueId === seasonLeagueId);
          }

          return (<PointsAgainst stats={weeksToEvaluate}></PointsAgainst>)
        case "none":
            return (<div></div>);
    }
  }
}

export default withRouter(SeasonOverview);
