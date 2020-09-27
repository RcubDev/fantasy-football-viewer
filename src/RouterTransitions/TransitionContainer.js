import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import LeagueSelector from "../Pages/LeagueSelector";
import League from "../Pages/League/League";
import SeasonOverview from "../Pages/SeasonOverview/SeasonOverview";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./TransitionContainer.css";

function TransitionContainer({ location }) {
  return (
    <div style={{ width: "100%" }}>
            <Switch location={location}>
              <Route path="/League/:internalLeagueId/Seasons/:seasonId/View/:view">
                <SeasonOverview></SeasonOverview>
              </Route>
              <Route path="/League/:internalLeagueId">
                <League></League>
              </Route>
              <Route path="/">
                <LeagueSelector></LeagueSelector>
              </Route>
            </Switch>
    </div>
  );
}

export default withRouter(TransitionContainer);
