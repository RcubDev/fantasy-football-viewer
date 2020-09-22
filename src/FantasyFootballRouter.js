import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LeagueSelector from "./Pages/LeagueSelector";
import League from "./Pages/League/League";

function FantasyFootballRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/League/:internalLeagueId">
            <League></League>
        </Route>
        <Route path="/">
            <LeagueSelector></LeagueSelector>
        </Route>
      </Switch>
    </Router>
  );
}

export default FantasyFootballRouter;
