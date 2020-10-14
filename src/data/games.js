const _ = require('lodash');
const dayjs = require('dayjs');

const sportlink = require('./source/sportlink');
const teamCode = require('./util/team-code');

/**
 * @return {Object[]}
 */
async function getGames(config) {
    const games = await sportlink('programma');

    games.forEach((game) => {
        game.home = (game.teamnaam === game.thuisteam)
        game.needsReferee = game.home;
        game.teamCode = teamCode.get(game.teamnaam);

        game.wedstrijddatum = dayjs(game.wedstrijddatum);
        game.startDateTime = setTime(game.wedstrijddatum, game.aanvangstijd);
        game.leaveDateTime = game.home ? null : setTime(game.wedstrijddatum, game.vertrektijd);
        game.event = getGameEvent(game, config);
    });
    return games;
}
exports.getGames = _.memoize(getGames);


function setTime(datetime, timeString) {
    const split = timeString.split(':');
    for (let i=0; i<4; i++) {
        split[i] = split[i] || 0;
    }

    return datetime
        .set('hour', split[0])
        .set('minute', split[1])
        .set('second', split[2])
        .set('millisecond', split[3]);
}


function getGameEvent(game, config) {
    let travelDuration = 0;
    if (!game.home) {
        if (_.isNull(game.leaveDateTime)) {
            throw new Error(`No leave time had been defined for match: ${game.wedstrijd}`);
        }
        travelDuration = game.startDateTime - game.leaveDateTime;
    }

    const scheduleStart = game.startDateTime
        .subtract(travelDuration, 'millisecond')
        .subtract(config.schedule.game.buffer.before, 'minute');
    const scheduleEnd = game.startDateTime
        .add(config.schedule.game.duration, 'minute')
        .add(config.schedule.game.buffer.after, 'minute')
        .add(travelDuration, 'millisecond');

    return {
        title: game.wedstrijd,
        start: scheduleStart,
        end: scheduleEnd,
    };
}
