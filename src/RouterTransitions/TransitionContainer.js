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
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          timeout={{ enter: 1000, exit: 1000 }}
          classNames="fade"
        >
          <section className="route-section">
            <Switch location={location}>
              <Route path="/League/:internalLeagueId/Seasons/:seasonId">
                <SeasonOverview></SeasonOverview>
              </Route>
              <Route path="/League/:internalLeagueId">
                <League></League>
              </Route>
              <Route path="/">
                <LeagueSelector></LeagueSelector>
              </Route>
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default withRouter(TransitionContainer);
