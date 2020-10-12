const got = require('got');
const qs = require('qs');

const BASE_URL = 'https://data.sportlink.com/';
const API_KEY = require('../../../../secrets.json').sportlink.client_id;

/**
 * @param {string} endpoint
 * @param {Object} queryString
 */
async function callSportlink(endpoint, queryString={}) {
    queryString.client_id = API_KEY;

    return got(`${endpoint}?${qs.stringify(queryString)}`, {
        prefixUrl: BASE_URL,
        http2: true,
    }).json();
}
module.exports = callSportlink;
