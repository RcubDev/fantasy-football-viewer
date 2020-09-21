import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MegaMenu } from "primereact/megamenu";
import { TieredMenu } from "primereact/tieredmenu";
import { Card } from "primereact/card";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import leagueInfo from "../data/league/LeagueInfo";
import "./LeagueSelector.css"
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router-dom'


class LeagueSelector extends React.Component {
  leagueIds = ["528423", "516886"];
  currentYear = 2020;
  //data = require('./data/league/516886/2020/516886-league-info.json');

  nextPath(path) {
    debugger;
    this.props.history.push(path);
  }

  ReadAllLeagueInfo() {
    let leagues = [];
    let info = leagueInfo;
    info.forEach((element) => {
      let item = (
        <div className="test p-col p-shadow-10" style={{ margin: 100, padding:0, cursor: "pointer" }} onClick={() => this.nextPath(`/League/${element.league_id}`)}>
          <div style={{ textAlign: "center", width:"100%", height:"100%", padding:100 }} className="text">
            <h1>{element.name}</h1>
            <label>League ID: {element.league_id}</label>
          </div>
        </div>
      );
      leagues.push(item);
    });
    return leagues;
  }

  render() {
    return (
      <div style={{ width: "100%", margin: 0, padding: 0, height: 600 }}>
        <div className="p-grid p-align-center">
          {this.ReadAllLeagueInfo()}
        </div>
      </div>
    );
  }
}

export default withRouter(LeagueSelector);
