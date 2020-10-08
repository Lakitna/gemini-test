module.exports = {
    reporter: 'mocha-multi-reporters',
    'reporter-option': [
        'configFile=.mocha-reporterrc.js'
    ],
    recursive: true,
    require: [
        'choma',
        'chai/register-expect',
        './test/setup.js',
    ],
    'watch-files': [
        'test/**/*',
        'src/**/*',
    ],
};
