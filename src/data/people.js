const _ = require('lodash');

const sheets = require('./source/sheets');
const teamCode = require('./util/team-code');

/**
 * @param {Object[]} teams
 * @return {Object[]}
 */
async function getPeople(teams) {
    const doc = await sheets.getGoogleDoc();
    const people = await sheets.getSheetDataAsObject(doc, 'People');

    const teamCodes = teams.map((team) => {
        return team.teamcode;
    });

    people.forEach((person) => {
        person.refereeCapabilities = teamCode.match(person.refereeCapabilities, teamCodes);
        person.activeDuring = teamCode.match(person.activeDuring, teamCodes);
    });
    return people;
}
exports.getPeople = _.memoize(getPeople);
