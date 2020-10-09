const data = require('../data');

/**
 *
 */
async function schedule() {
    const doc = await data.sheets.getGoogleDoc('1tQLGSWgCOzJ5oz3unNpYD9b1GEh6ut24GnH0MlW1hJs')

    const people = await data.sheets.getSheetDataAsObject(doc, 'People');
    console.log(people);
}
exports.schedule = schedule;
