//isWeekly = data for weekly view instead of season overview
//maxNumManagers: maxNumber of managers
//sortBy = "asc" or "desc"

export const GetTopPointsFor = (isWeekly, maxNumManagers, sortBy, stats) => {
    
  let pointScorers = [];
  if (isWeekly) {
    stats.forEach((week) => {
      let matchups = week.data.matchups;
      if (matchups) {
        matchups.forEach((matchup) => {
          matchup.matchup.teams.forEach((team) => {
            let managerData = { ...team.team.managers.manager };
            if (managerData.nickname === "--hidden--") {
              managerData.nickname = team.team.name;
            }
            pointScorers = CalculateTopSingleWeekPointsFor(
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
  } else {
    //SETUP SEASON TOTAL VIEW.

    let scoresDictionary = {};
    stats.forEach((week) => {
      let matchups = week.data.matchups;
      if (matchups) {
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
              week: week.data.week,
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
  }
  console.log(pointScorers);
  return pointScorers;
};

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

function CalculateTopSeasonScorer(
  maxNumManagers,
  sortBy,
  pointScorers,
  teamManager,
  teamPoints
) {}
