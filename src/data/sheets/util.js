const _ = require('lodash');
const { GoogleSpreadsheet, GoogleSpreadsheetRow } = require('google-spreadsheet');

const CREDENTIALS = require('../../../google-credentials.json');

/**
 * @param {string} id
 * @return {GoogleSpreadsheet}
 */
async function getGoogleDoc(id) {
    const doc = new GoogleSpreadsheet(id);

    await doc.useServiceAccountAuth(CREDENTIALS);
    await doc.loadInfo();
    return doc;
}
exports.getGoogleDoc = getGoogleDoc;

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

        return obj;
    });

    return plainRows;
}
exports.getSheetDataAsObject = getSheetDataAsObject;
