//isWeekly = data for weekly view instead of season overview
//maxNumManagers: maxNumber of managers
//sortBy = "asc" or "desc"

function LoopMatchups(callBack, maxNumManagers, sortBy, stats) {
  let pointScorers = [];

  stats.forEach((week) => {
    let matchups = week.data.matchups;
    if (matchups.length > 0) {
      matchups.forEach((matchup) => {
        matchup.matchup.teams.forEach((team) => {
          let managerData = { ...team.team.managers.manager };
          if (managerData.nickname === "--hidden--") {
            managerData.nickname = team.team.name;
          }
          pointScorers = callBack(
            maxNumManagers,
            sortBy,
            pointScorers,
            managerData,
            parseFloat(team.team.team_points.total),
            week.data.week
          );
        });
      });
    }
  });
  return pointScorers;
}

function LoopMatchupsPassMatchupTeams(callBack, maxNumManagers, sortBy, stats) {
  let pointScorers = [];
  stats.forEach((week) => {
    let matchups = week.data.matchups;
    if (matchups.length > 0) {
      matchups.forEach((matchup) => {
        pointScorers = callBack(
          maxNumManagers,
          sortBy,
          pointScorers,
          matchup.matchup.teams
        );
      });
    }
  });
  return pointScorers;
}

export const GetTopPointsFor = (viewType, maxNumManagers, sortBy, stats) => {
  let pointScorers = [];
  if (viewType === "topweeks") {
    pointScorers = LoopMatchups(
      CalculateTopSingleWeekPointsFor,
      maxNumManagers,
      sortBy,
      stats
    );
  } else if (viewType === "seasontotal") {
    //SETUP SEASON TOTAL VIEW.

    let scoresDictionary = {};
    stats.forEach((week) => {
      let matchups = week.data.matchups;
      if (matchups.length > 0) {
        matchups.forEach((matchup) => {
          matchup.matchup.teams.forEach((team) => {
            let managerData = { ...team.team.managers.manager };
            if (managerData.nickname === "--hidden--") {
              managerData.nickname = team.team.name;
            }
            let newScore = {
              points: +parseFloat(team.team.team_points.total),
              managerGUID: managerData.guid,
              managerName: managerData.nickname,
              week: "-1",
            };
            if (scoresDictionary[newScore.managerGUID]) {
              scoresDictionary[newScore.managerGUID].points +=
                newScore.points;
            } else {
              scoresDictionary[newScore.managerGUID] = newScore;
            }
          });
        });
      }
    });
    pointScorers = Object.values(scoresDictionary);
    pointScorers = sortScores(sortBy, pointScorers);
    pointScorers = pointScorers.map(x => ({...x, points: +x.points.toFixed(2)}));
  } else if (viewType === "weekbyweek") {
    pointScorers = LoopMatchups(
      CalculateWeeklyScores,
      maxNumManagers,
      sortBy,
      stats
    );
  }
  return pointScorers;
};

function CalculateWeeklyScores(
  maxNumManagers,
  sortBy,
  pointScorers,
  teamManager,
  teamPoints,
  weekNumber
) {
  let newPointScorer = {
    points: teamPoints,
    managerGUID: teamManager.guid,
    managerName: teamManager.nickname,
    week: weekNumber,
  };
  if (pointScorers[parseInt(weekNumber) - 1]) {
    pointScorers[parseInt(weekNumber) - 1].data.push(newPointScorer);
  } else {
    pointScorers.push({
      week: parseInt(weekNumber),
      data: [newPointScorer],
    });
  }
  return pointScorers;
}

function CalculateTopSingleWeekPointsFor(
  maxNumManagers,
  sortBy,
  pointScorers,
  teamManager,
  teamPoints,
  weekNumber
) {
  let newPointScorer = {
    points: teamPoints,
    managerGUID: teamManager.guid,
    managerName: teamManager.nickname,
    week: weekNumber,
  };
  let newScorerAdded = false;
  if (pointScorers.length < maxNumManagers) {
    pointScorers.push(newPointScorer);
    newScorerAdded = true;
  } else if(newPointScorer.points > 0) {
    //   pointScorers.pop();
    if (sortBy === "asc") {
      if (
        pointScorers[pointScorers.length - 1].points <
        newPointScorer.points
      ) {
        pointScorers.pop();
        pointScorers.push(newPointScorer);
        newScorerAdded = true;
      }
    } else if (sortBy === "desc") {
      if (pointScorers[pointScorers.length - 1].points > newPointScorer.points) {
        pointScorers.pop();
        pointScorers.push(newPointScorer);
        newScorerAdded = true;
      }
    }
  }
  if (newScorerAdded) {
    pointScorers = sortScores(sortBy, pointScorers);
  }
  return pointScorers;
}

function sortScores(sortBy, pointScorers) {
  if (sortBy === "asc") {
    pointScorers = pointScorers.sort((x, y) =>
      x.points < y.points ? 1 : -1
    );
  } else if (sortBy === "desc") {
    pointScorers = pointScorers.sort((x, y) =>
      x.points > y.points ? 1 : -1
    );
  }
  return pointScorers;
}

export const GetTopPointsAgainst = (
  viewType,
  maxNumManagers,
  sortBy,
  stats
) => {
  return LoopMatchupsPassMatchupTeams(GetPointsAgainstSeason, maxNumManagers, sortBy, stats);
};

export const CalculateWins = (viewType, maxNumManagers, sortBy, stats) => {
  return LoopMatchupsPassMatchupTeams(CalculateWinsSeason, maxNumManagers, sortBy, stats);
}

function CalculateWinsSeason(maxNumManagers, sortBy, pointScorers, teams) {
  let team1 = teams[0].team;
  let team2 = teams[1].team;
  let winner;
  if(team2.team_points.total === "94.34"){
    debugger;
  }
  if(+team1.team_points.total > +team2.team_points.total){
    winner = team1;
  }
  else if(+team2.team_points.total > +team1.team_points.total) {
    winner = team2;
  }
  else {
    //TIE?
    winner = null;
  }
  
  if(team1.managers.manager.guid === "CZKBUGJNKCXVECGR2Z5BXC2E7M" || team2.managers.manager.guid === "CZKBUGJNKCXVECGR2Z5BXC2E7M") {
    console.log("winner:");
    console.log(winner.managers.manager.nickname);
    console.log(winner.team_points.total);
    console.log("team1:");
    console.log(team1.managers.manager.nickname);
    console.log("team2:");
    console.log(team2.managers.manager.nickname);
  }

  let existingPointScorer = pointScorers.findIndex(x => x.managerGUID === winner.managers.manager.guid);
  if(existingPointScorer !== -1) {
    pointScorers[existingPointScorer].data++;
  }
  else{
    pointScorers.push({ 
      managerGUID: winner.managers.manager.guid,
      managerName: winner.managers.manager.nickname,
      data: 1
     });
  }
  return pointScorers;
}

function GetPointsAgainstSeason(maxNumManagers, sortBy, pointScorers, teams) {
  //ALL MATCHUPS SHOULD HAVE 2 TEAMS ONLY.
  let team1 = teams[0].team;
  let team2 = teams[1].team;

  let matchupData = [
    {
      points: +(team1.team_points.total),
      managerGUID: team2.managers.manager.guid,
      managerName: team2.managers.manager.nickname,
    },
    {
      points: +(team2.team_points.total),
      managerGUID: team1.managers.manager.guid,
      managerName: team1.managers.manager.nickname,
    },
  ];

  matchupData.forEach((data) => {

    let existingPointScorerIndex = pointScorers.findIndex(
      (x) => x.managerGUID === data.managerGUID
    );
    if (existingPointScorerIndex === -1) {
      pointScorers.push(data);
    } else {
      pointScorers[existingPointScorerIndex].points +=
        +data.points;
    }
  });

  pointScorers = sortScores("asc", pointScorers);
  pointScorers = pointScorers.map(x => ({...x, points: +x.points.toFixed(2)}));
  return pointScorers;
}
