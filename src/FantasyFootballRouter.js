import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TransitionContainer from "./RouterTransitions/TransitionContainer";

function FantasyFootballRouter() {
  return (
    <Router>
      <TransitionContainer></TransitionContainer>
    </Router>
  );
}

export default FantasyFootballRouter;
