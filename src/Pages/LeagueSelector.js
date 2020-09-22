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
import leagueInfo from "../data/league/LeagueInfoData";
import leagues from "../data/league/LeaguesData";
import "./LeagueSelector.css";
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

class LeagueSelector extends React.Component {

  currentYear = 2020;
  //data = require('./data/league/516886/2020/516886-league-info.json');

  nextPath(path) {
    this.props.history.push(path);
  }

  ReadAllLeagueInfo() {
    let leaguesGrid = [];
    let info = _.uniqBy(leagues, 'internalId');
    debugger;
    info.forEach((element) => {
      let item = (
        <div className="hover-div p-col p-shadow-10" style={{ margin: 100, padding:0, cursor: "pointer" }} onClick={() => this.nextPath(`/League/${element.internalId}`)}>
          <div style={{ textAlign: "center", width:"100%", height:"100%", padding:100 }} className="hover-div-text">
            <h1>{element.name}</h1>
          </div>
        </div>
      );
      leaguesGrid.push(item);
    });
    return leaguesGrid;
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
