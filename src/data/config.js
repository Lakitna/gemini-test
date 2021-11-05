const _ = require('lodash');
const { unflatten } = require('flat');

const sheets = require('./source/sheets');
const teamCode = require('./util/team-code')

/**
 * @return {Object[]}
 */
async function getConfig() {
    const doc = await sheets.getGoogleDoc();
    const flatConfig = {};
    (await sheets.getSheetDataAsObject(doc, 'Config'))
        .forEach((row) => {
            flatConfig[row.key] = row.value;
        });

    const config = unflatten(flatConfig);
    config.points.referee = parsePatternedConfig(config.points.referee);
    config.schedule.game.duration = parsePatternedConfig(config.schedule.game.duration);
    return config;
}
exports.getConfig = _.memoize(getConfig);

/**
 * @param {Object} object
 * @return {Object}
 */
function parsePatternedConfig(object) {
    const mapped = _.mapKeys(object, (_, key) => {
        if (key === 'default') return '*';
        return teamCode.toPattern(key);
    });

    if (_.isUndefined(mapped['*'])) {
        return mapped;
    }

    return _.mapValues(mapped, (value) => {
        if (!value) {
            return mapped['*'];
        }
        return value;
    })
}
