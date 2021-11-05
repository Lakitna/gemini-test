const _ = require('lodash');
const seedrandom = require('seedrandom');
const minimatch = require('minimatch');

const configService = require('../data/config');
const peopleService = require('../data/people');
const teamService = require('../data/teams');
const gameService = require('../data/games');

const { Schedule, Event } = require('./schedule');

/**
 *
 */
async function schedule() {
    console.log('Gathering data...');
    const config = await configService.getConfig();
    const teams = await teamService.getTeams();
    const people = await peopleService.getPeople(teams);
    let games = await gameService.getGames(config);

    const seed = _.get(config, 'random.seed') || Math.random();
    console.log(`config.random.seed: ${seed}`);
    const random = seedrandom(seed);

    games.forEach((game) => {
        game.random = random();
        game.event = new Event(game.event.title, game.event.start, game.event.end, game);
    });
    // We're shuffeling the games here to make sure that those who start the process with points
    // have the effect of it being spread out over the entire season.
    games = _.sortBy(games, ['random']);

    people.forEach((person) => {
        person.random = random();
        buildPersonalSchedule(person, games);
    });

    assignReferees(games, people, config);
    // assignBar(games, people, config);

    console.log('-'.repeat(50));
    people.forEach((person) => {
        console.log(`${person.fullName}: ${person.points}pt`);
    });

    games = _.sortBy(games, ['event.start'])
    games.forEach((game) => {
        console.log(game.event.title);
    })

    await gameService.setGames(games);
}
exports.schedule = schedule;


/**
 * @param {Object[]} person
 * @param {Object[]} games
 */
function buildPersonalSchedule(person, games) {
    person.schedule = new Schedule();
    games.forEach((game) => {
        if (person.activeDuring.includes(game.teamCode)) {
            person.schedule.add(game.event);
        }
    });
}

/**
 * @param {Object[]} games
 * @param {Object[]} people
 * @param {Object} config
 */
function assignReferees(games, people, config) {
    games
        .filter((game) => game.needsReferee)
        .forEach((game) => {
            console.log(`${game.wedstrijd}:`);

            game.potentialReferees = people
                .filter((person) => {
                    return person.refereeCapabilities.includes(game.teamCode);
                })
            console.log(`  ${game.potentialReferees.length} capable referees.`);

            game.potentialReferees = game.potentialReferees
                .filter((person) => {
                    // Don't pick someone who will be active during (part of) the game.
                    return person.schedule.isAvailable(game.event);
                })
                .filter((person) => {
                    // Don't pick someone who is already a ref for another game that day.
                    return person.schedule.some((event) => {
                        return event.game.datum === game.datum;
                    });
                });

            console.log(`  ${game.potentialReferees.length} available referees.`);
            if (game.potentialReferees.length === 0) {
                console.warn(`  !! Can'f find a referee !!`);
                game.referee = null;
                return;
            }

            // `games` get assigned the available referee with the lowest points.
            // Seeded randomness used as a tie breaker. This prevents scheduling side
            // effect patterns from emerging across seasons.
            game.referee = _.first(_.sortBy(game.potentialReferees, ['points', 'random']));
            game.referee.points += gamePoints(game, config);
            game.referee.schedule.add(game.event);
            console.log(`  Referee: ${game.referee.fullName}.`);
        });
}

function gamePoints(game, config) {
    const matchingPatterns = _.keys(config.points.referee)
        .filter((pattern) => {
            return minimatch(game.teamCode, pattern);
        })
        .sort()
        .reverse();

    if (matchingPatterns.length === 0) {
        throw new Error(`Could not find a matching pattern for '${game.teamCode}'. `
            + `Did you get rid of the default?`);
    }

    return config.points.referee[_.first(matchingPatterns)];
}
