const _ = require('lodash');
const { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } = require('google-spreadsheet');

const SHEET_ID = '1tQLGSWgCOzJ5oz3unNpYD9b1GEh6ut24GnH0MlW1hJs';
const CREDENTIALS = require('../../../../google-credentials.json');

/**
 * @param {string} [id]
 * @return {GoogleSpreadsheet}
 */
async function getGoogleDoc(id=SHEET_ID) {
    const doc = new GoogleSpreadsheet(id);
    await doc.useServiceAccountAuth(CREDENTIALS);
    await doc.loadInfo();
    return doc;
}
exports.getGoogleDoc = _.memoize(getGoogleDoc);

/**
 * @param {GoogleSpreadsheet} doc
 * @param {string} sheetTitle
 * @return {GoogleSpreadsheetRow[]}
 */
async function getSheetData(doc, sheetTitle) {
    const sheet = doc.sheetsByTitle[sheetTitle];
    return sheet.getRows();
}
exports.getSheetData = getSheetData;

/**
 * @param {GoogleSpreadsheet} doc
 * @param {string} sheetTitle
 * @param {object[]} data
 */
async function replaceSheetData(doc, sheetTitle, data) {
    const sheet = doc.sheetsByTitle[sheetTitle];
    await sheet.clear();
    await sheet.setHeaderRow(_.keys(data[0]));
    await sheet.addRows(data);
}
exports.replaceSheetData = replaceSheetData;

/**
 * @param {GoogleSpreadsheet} doc
 * @param {string} sheetTitle
 * @return {Object[]}
 */
async function getSheetDataAsObject(doc, sheetTitle) {
    const rows = await exports.getSheetData(doc, sheetTitle);

    const plainRows = rows.map((row) => {
        const keys = _.keys(row).filter((key) => !key.startsWith('_'));
        const obj = {};

        keys.forEach((key) => {
            obj[key] = row[key];
        });

        return _.mapValues(obj, (value) => {
            if (value === '') return value;
            if (value === 'TRUE') return true;
            if (value === 'FALSE') return false;
            if (!_.isNaN(Number(value))) return Number(value);
            return value;
        });
    });

    return plainRows;
}
exports.getSheetDataAsObject = getSheetDataAsObject;
