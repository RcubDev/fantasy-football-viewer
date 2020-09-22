import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import leagues from "../data/league/LeaguesData";
import "./LeagueSelector.css";
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Zoom from 'react-reveal/Zoom'
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
        <div className="hover-div p-col p-shadow-10" style={{ margin: 25, padding:0, cursor: "pointer" }} onClick={() => this.nextPath(`/League/${element.internalId}`)}>
          <div style={{display:"flex", alignItems:"center", textAlign: "center", justifyContent: "center", width:"100%", height:350}} className="hover-div-text">
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
      <div style={{width: "80%"}}>
        <Zoom duration={2000}>
          <div className="p-grid p-align-center">
            {this.ReadAllLeagueInfo()}
          </div>
        </Zoom>
        
      </div>
      
    );
  }
}

export default withRouter(LeagueSelector);
