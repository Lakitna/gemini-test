const _ = require('lodash');

const sportlink = require('./source/sportlink');
const teamCode = require('./util/team-code');

/**
 * @return {Object[]}
 */
async function getGames() {
    const games = await sportlink('programma');

    games.forEach((game) => {
        game.dateString = game.wedstrijddatum.split('T')[0];
        game.wedstrijddatum = new Date(game.wedstrijddatum.split('+')[0] + 'Z');
        game.needsReferee = (game.teamnaam === game.thuisteam);
        game.teamCode = teamCode.get(game.teamnaam);

        if (_.isEmpty(game.vertrektijd)) {
            game.scheduleStart = new Date(`${game.dateString}T${game.aanvangstijd}Z`);
            game.scheduleEnd = new Date(game.scheduleStart.getTime() + 70 * 60*1000);
        }
        else {
            const leaveTime = new Date(`${game.dateString}T${game.vertrektijd}Z`);
            const startTime = new Date(`${game.dateString}T${game.aanvangstijd}Z`);
            const travelTime = startTime.getTime() - leaveTime.getTime();

            game.scheduleStart = leaveTime;
            game.scheduleEnd = new Date(startTime.getTime() + 70 * 60*1000 + travelTime);
        }
    });
    return games;
}
exports.getGames = _.memoize(getGames);
