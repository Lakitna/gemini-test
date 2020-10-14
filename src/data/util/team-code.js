const _ = require('lodash');
const minimatch = require('minimatch');

/**
 * @param {string} teamName
 */
function getTeamCode(teamName) {
    const match = teamName.match(/\s(\w?\d+)$/i);

    if (_.isNull(match)) {
        console.warn(`Could not find a team number for '${name}'.`);
        return '';
    }

    const teamCode = match[1];
    if (_.isNaN(Number(teamCode))) {
        return teamCode;
    }
    return `S${teamCode}`;
}
exports.get = getTeamCode;

/**
 * @param {string} codePatterns
 * @param {string[]} teamCodes
 * @return {string[]}
 */
function matchTeamCodes(codePatterns, teamCodes) {
    if (_.isEmpty(codePatterns)) return [];
    const definitions = codePatterns.split(/[,;]/g)
        .map((pattern) => {
            return exports.toPattern(pattern);
        })
        .filter((pattern) => !_.isEmpty(pattern));

    const codes = teamCodes.filter((code) => {
        const match = definitions.find((definition) => {
            return minimatch(code, definition);
        });
        return !_.isUndefined(match);
    });
    return [...new Set(codes)];
}
exports.match = matchTeamCodes;

/**
 * @param {string} string
 * @return {string}
 */
function toPattern(string) {
    string = string.trim().toUpperCase();
    if (/^[A-Z]$/.test(string)) {
        string += '*';
    }
    return string;
}
exports.toPattern = toPattern;
