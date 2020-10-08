const path = require('path');
const reporterRc = require('./.mocha-reporterrc.js');

reporterRc.xunitReporterOptions.output = path.join(__dirname, 'reports/mocha-xunit.e2e.xml');
module.exports = reporterRc;
