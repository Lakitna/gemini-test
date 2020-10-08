const path = require('path');
module.exports = {
    reporterEnabled: 'spec, xunit',
    xunitReporterOptions: {
        output: path.join(__dirname, 'reports/mocha-xunit.xml'),
    },
};
