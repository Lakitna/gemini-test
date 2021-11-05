const _ = require('lodash');
const dayjs = require('dayjs');
const minimatch = require('minimatch');

const sportlink = require('./source/sportlink');
const sheets = require('./source/sheets');
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


async function setGames(games) {
    const doc = await sheets.getGoogleDoc();

    const rows = games.map((game) => {
        return {
            homeTeam: game.thuisteam,
            awayTeam: game.uitteam,
            isHomeGame: game.home,
            needsReferee: game.needsReferee,
            referee: _.get(game, 'referee.fullName', false),
            start: game.startDateTime.toISOString(),
        }
    })

    return sheets.replaceSheetData(doc, 'Game schedule', rows);
}
exports.setGames = setGames


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
    const gameDuration = getPatternedValue(config.schedule.game.duration, game.teamCode);
    const scheduleEnd = game.startDateTime
        .add(gameDuration, 'minute')
        .add(config.schedule.game.buffer.after, 'minute')
        .add(travelDuration, 'millisecond');

    return {
        title: game.wedstrijd,
        start: scheduleStart,
        end: scheduleEnd,
        game: game,
    };
}

function getPatternedValue(patternedConfig, pattern) {
    const matchingPatterns = _.keys(patternedConfig)
        .filter((patt) => {
            return minimatch(pattern, patt);
        })
        .sort()
        .reverse();

    if (matchingPatterns.length === 0) {
        throw new Error(`Coult not find a match for '${pattern}' in patterns `
            + `['${_.keys(patternedConfig).join(`', '`)}']`);
    }
    return patternedConfig[matchingPatterns[0]];
}
