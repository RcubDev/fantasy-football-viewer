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
import teams from "../../data/league/Teams";
import _ from 'lodash';


class LeagueInfo extends React.Component {

}

export default withRouter(LeagueInfo);