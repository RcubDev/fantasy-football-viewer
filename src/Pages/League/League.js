import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  withRouter,
} from "react-router-dom";
import { Button } from "primereact/button";
import "./League.css";
import "../LeagueSelector.css";
import leagueInfo from "../../data/league/LeagueInfoData";
import leagues from "../../data/league/LeaguesData";
import teams from "../../data/league/Teams";
import _ from "lodash";
import getManagersForLeague from '../../Helpers/DataHelper'

class League extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isReady: false,
      leagueManagers: null,
      internalLeagueid: -1
    };
  }

  componentDidMount() {
    let id = this.props.match.params.internalLeagueId;
    let managers = getManagersForLeague(id, leagues, teams);
    this.setState({
      isReady: true,
      leagueManagers: managers,
      internalLeagueId: id
    });
  }


  nextPath(path) {
    this.props.history.push(path);
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
            onClick={() =>
              this.nextPath(
                `/League/${internalLeagueId}/Seasons/${element.league_id}`
              )
            }
          ></Button>
        </div>
      );
      seasonButtons.push(result);
    });
    return seasonButtons;
  }

  CreateManagers(leagueId) {
    let managerButtons = [];    

    this.state.leagueManagers.forEach((manager) => {
      let result = (
        <div
          className="p-col"
          id={leagueId + manager.manager.nickname + "pCol"}
        >
          <Button
            className="manager-btn-item"
            label={manager.manager.nickname}
            id={leagueId + manager.manager.nickname + "Button"}
          ></Button>
        </div>
      );
      managerButtons.push(result);
    });
    return managerButtons;
  }

  render() {
    if (!this.state.isReady) {
      return <div></div>;
    } else {
      let id = this.props.match.params.internalLeagueId;
      return (
        <div style={{ height: 500 }}>
          <div
            className="p-grid p-align-center"
            style={{ cursor: "pointer", height: "80%" }}
          >
            <div
              onClick={() => {
                this.nextPath(`/League/${id}/info`);
              }}
              className="hover-div hover-div-text card-item p-col p-shadow-10"
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "80%",
              }}
            >
              <h2 style={{ padding: 0 }}>{"League Overview"}</h2>
            </div>
            <div
              className="card-item p-col p-shadow-10"
              style={{ width: "100%", height: "80%" }}
            >
              <div className="p-grid p-align-center">
                <div className="p-col">
                  <h2>Season Overview</h2>
                  <div className="p-grid" style={{ textAlign: "center" }}>
                    {this.CreateSeasons(id)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-grid p-align-center" style={{ cursor: "pointer" }}>
            <div
              className="card-item p-col p-shadow-10"
              style={{ width: "60%" }}
            >
              <div className="p-grid p-align-center">
                <div className="p-col">
                  <h2>Manager Overview</h2>
                  <div className="p-grid" style={{ textAlign: "center" }}>
                    {this.CreateManagers(id)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          Now showing league id: {id}
        </div>
      );
    }
  }
}

export default withRouter(League);
