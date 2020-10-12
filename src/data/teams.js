const _ = require('lodash');

const sportlink = require('./source/sportlink');
const teamCode = require('./util/team-code');

// TODO: Get from sheet instead?

/**
 * @return {Object[]}
 */
async function getTeams() {
    const teams = await sportlink('teams');

    return teams.map((team) => {
        team.teamid = team.teamcode;
        team.teamcode = teamCode.get(team.teamnaam);
        return team;
    });
}
exports.getTeams = _.memoize(getTeams);
