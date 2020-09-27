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
            parseInt(team.team.team_points.total),
            week.data.week
          );
        });
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
    debugger;
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
              pointsScored: parseInt(team.team.team_points.total),
              managerGUID: managerData.guid,
              managerName: managerData.nickname,
              week: "-1",
            };
            if (scoresDictionary[newScore.managerGUID]) {
              scoresDictionary[newScore.managerGUID].pointsScored +=
                newScore.pointsScored;
            } else {
              scoresDictionary[newScore.managerGUID] = newScore;
            }
          });
        });
      }
    });
    pointScorers = Object.values(scoresDictionary);
    pointScorers = sortScores(sortBy, pointScorers);
  } else if (viewType === "weekbyweek") {
    pointScorers = LoopMatchups(CalculateWeeklyScores, maxNumManagers, sortBy, stats);
    console.log(pointScorers);
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
        pointsScored: teamPoints,
        managerGUID: teamManager.guid,
        managerName: teamManager.nickname,
        week: weekNumber,
      };
    if(pointScorers[parseInt(weekNumber) - 1]) {
        pointScorers[parseInt(weekNumber) - 1].data.push(newPointScorer);
    }
    else{
        pointScorers.push({
            week: parseInt(weekNumber),
            data: [newPointScorer]
        })
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
    pointsScored: teamPoints,
    managerGUID: teamManager.guid,
    managerName: teamManager.nickname,
    week: weekNumber,
  };
  let newScorerAdded = false;
  if (pointScorers.length < maxNumManagers) {
    pointScorers.push(newPointScorer);
    newScorerAdded = true;
  } else {
    //   pointScorers.pop();
    if (sortBy === "asc") {
      if (
        pointScorers[pointScorers.length - 1].pointsScored <
        newPointScorer.pointsScored
      ) {
        pointScorers.pop();
        pointScorers.push(newPointScorer);
        newScorerAdded = true;
      }
    } else if (sortBy === "desc") {
      if (
        pointScorers[pointScorers.length - 1].pointsScored >
        newPointScorer.pointsScored
      ) {
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
      x.pointsScored < y.pointsScored ? 1 : -1
    );
  } else if (sortBy === "desc") {
    pointScorers = pointScorers.sort((x, y) =>
      x.pointsScored > y.pointsScored ? 1 : -1
    );
  }
  return pointScorers;
}
