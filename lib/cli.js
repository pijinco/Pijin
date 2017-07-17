#!/usr/bin/env node
'use strict';

const yargs = require('yargs')
const pack = require('./package')
const init = require('./init')


/**
 * Install dependencies used in the pre and post tests
 */
yargs
  .command({
    command: 'install <packages...>',
    aliases: ['i'],
    desc: 'Install dependencies used in the pre and post tests',
    handler: ({ packages }) => pack.install(packages)
  })


/**
 * Initialize Pijin in the current directory.
 * Creates a `pijin.json` file in the current directory.
 */
yargs
  .command({
    command: 'init',
    desc: 'Initialize Pijin in the current directory',
    handler: () => init(process.cwd(), {})
  })


/**
 * Generate help and output argv
 */
yargs
  .help('help')
  .alias('help', 'h')


/**
 * Print out the arguments
 */
if (yargs.argv.output)
  console.log(yargs.argv.output);
