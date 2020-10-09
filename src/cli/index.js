#! /usr/bin/env node
require('make-promises-safe');
const commander = require('commander');

const scheduler = require('../scheduler');

const packageJson = require('../../package.json');

const program = new commander.Command();
module.exports = program;

program
    .version(packageJson.version)
    .name('gemini')
    .usage('<command>')
    .description(`TBD`);

program
    .command('schedule')
    .usage('[options]')
    .description(`TBD`)
    .action(async (options) => {
        return scheduler.schedule();
    });

program.on('command:*', function() {
    program.outputHelp();
    process.exit(1);
});

program.parse(process.argv);
