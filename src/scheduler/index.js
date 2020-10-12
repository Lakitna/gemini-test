const _ = require('lodash');

const peopleService = require('../data/people');
const teamService = require('../data/teams');
const gameService = require('../data/games');
const { Schedule } = require('./schedule');

// TODO: Move to config sheet
const scheduleBuffer = 5 * 60 * 1000; // 5 minutes
// TODO: Move to config sheet
// TODO: Make teamCodePattern based? S*=10,A*=5,B*=5,...
const REFEREE_POINTS = 5;

/**
 *
 */
async function schedule() {
    const teams = await teamService.getTeams();
    const people = await peopleService.getPeople(teams);
    const games = await gameService.getGames();

    // A person gets a schedule based on `games`
    people.forEach((person) => {
        person.schedule = new Schedule();
        games
            .filter((game) => {
                return person.activeDuring.includes(game.teamCode);
            })
            .forEach((game) => {
                person.schedule.add(
                    game.wedstrijd,
                    new Date(game.scheduleStart.getTime() - scheduleBuffer),
                    new Date(game.scheduleEnd.getTime() + scheduleBuffer));
            });
    });

    games.filter((game) => game.needsReferee)
        .forEach((game) => {
            console.log(`${game.wedstrijd}:`);

            // `games` that need a ref get a list of potential referees based on capabilities
            game.potentialReferees = people.filter((person) => {
                return person.refereeCapabilities.includes(game.teamCode);
            });
            console.log(`  ${game.potentialReferees.length} capable referees.`);

            // `games` filter potential referees based on persons schedule
            game.potentialReferees = game.potentialReferees.filter((person) => {
                return person.schedule.isAvailable(game.scheduleStart, game.scheduleEnd);
            });
            console.log(`  ${game.potentialReferees.length} available referees.`);

            // `games` get assigned available referee with the lowest points. Randomness used as
            // a tie breaker.
            game.referee = _.first(_.sortBy(game.potentialReferees, ['points', 'random']));
            game.referee.points += REFEREE_POINTS;
            console.log(`  Referee: ${game.referee.fullName}.`);
        });


    console.log('-'.repeat(50));
    people.forEach((person) => {
        console.log(`${person.fullName}: ${person.points}pt`);
    });
}
exports.schedule = schedule;
