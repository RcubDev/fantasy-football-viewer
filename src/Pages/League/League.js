import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
    withRouter
} from "react-router-dom";
import { Button } from 'primereact/button'
import './League.css';
import '../LeagueSelector.css';
import leagueInfo from "../../data/league/LeagueInfoData";
import leagues from '../../data/league/LeaguesData';
import teams from "../../data/league/Teams";
import _ from 'lodash';

class League extends React.Component {

    nextPath(path) {
        this.props.history.push(path);
    }

    CreateSeasons(leagueId) {
        let seasonButtons = [];   
        let leagueSeasons = leagues.filter((y) => y.internalId === parseInt(leagueId));
        leagueSeasons = leagueSeasons.map((x) => x.id);     
        let seasons = _.filter(leagueInfo, function(x) {
            return leagueSeasons.indexOf(x.league_id) > -1;
        });
        seasons.forEach(element => {
            let result = <div className="p-col" id={leagueId + element.season + "pCol"}>
                <Button label={element.season} id={leagueId + element.season + "Button"}></Button>
            </div>
            seasonButtons.push(result);
        });
        return seasonButtons;
    }

    CreateManagers(leagueId) {
        let managerButtons = [];
        let leagueSeasons = leagues.filter((y) => y.internalId === parseInt(leagueId));
        leagueSeasons = leagueSeasons.map((x) => x.id);     
        let managers = _.filter(teams, function (x) {
            let shouldReturn = false;
            leagueSeasons.forEach(sea => {
                if(x.team.team_key.indexOf(sea) > -1){
                    shouldReturn = true;
                }
            });
            return shouldReturn;
        });
        managers = _.map(managers, x => x.team.managers);
        managers = _.uniqBy(managers, "manager.guid");
        console.log(managers);

        managers.forEach(manager => {
            let result = <div className="p-col" id={leagueId + manager.manager.nickname + "pCol"}>
                <Button className="manager-btn-item" label={manager.manager.nickname} id={leagueId + manager.manager.nickname + "Button"}></Button>
            </div>
            managerButtons.push(result);
        });
        return managerButtons;
    }


    render() {
        let id = this.props.match.params.internalLeagueId;
        return (
            <div style={{height: 500}}>
                <div className="p-grid p-align-center" style={{cursor: "pointer", height: "80%"}}>
                    <div onClick={() => {this.nextPath(`/League/${id}/info`)}} className="hover-div hover-div-text card-item p-col p-shadow-10" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: 'center', height: "80%" }}>
                        <h2 style={{ padding: 0 }}>{"League Overview"}</h2>
                    </div>
                    <div className="card-item p-col p-shadow-10" style={{ width: "100%", height: "80%" }}>
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
                <div className="p-grid p-align-center" style={{cursor: "pointer" }}>
                    <div className="card-item p-col p-shadow-10" style={{ width: "60%" }}>
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


export default withRouter(League);