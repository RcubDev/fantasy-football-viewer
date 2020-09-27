import _ from 'lodash'

function getManagersForLeague(leagueId, leagues, teams) {
    let leagueSeasons = leagues.filter(
        (y) => y.internalId === parseInt(leagueId)
      );
      leagueSeasons = leagueSeasons.map((x) => x.id);
      let managers = _.filter(teams, function (x) {
        let shouldReturn = false;
        leagueSeasons.forEach((sea) => {
          if (x.team.team_key.indexOf(sea) > -1) {
            shouldReturn = true;
          }
        });
        return shouldReturn;
      });
      managers = _.map(managers, (x) => x.team.managers);
      managers = _.uniqBy(managers, "manager.guid");
      return managers;
}

export default getManagersForLeague;