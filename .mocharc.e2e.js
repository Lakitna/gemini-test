const mocharc = require('./.mocharc.js');

module.exports = {
    reporter: mocharc.reporter,
    'reporter-option': ['configFile=.mocha-reporterrc.e2e.js'],
    recursive: true,
    timeout: 20000,
    slow: 2000,
    exclude: [
        '.git',
        'node_modules',
        'e2e/**/resources/**',
    ],
    require: [
        'chai/register-expect',
        './test/setup.js',
    ],
    'watch-files': [
        'e2e/**/*',
        'src/**/*',
    ],
};
