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
    return config;
}
exports.getConfig = _.memoize(getConfig);

/**
 * @param {Object} object
 * @return {Object}
 */
function parsePatternedConfig(object) {
    return _.mapKeys(object, (_, key) => {
        if (key === 'default') return '*';
        return teamCode.toPattern(key);
    });
}
