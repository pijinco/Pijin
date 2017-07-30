#!/usr/bin/env node
'use strict'

const yargs = require('yargs')

const Conf = require('./conf')
const Init = require('./init')
const Pack = require('./package')

const conf = Conf()
const init = Init()
const pack = Pack()


/**
 * Install dependencies used in the pre and post test scripts
 */
yargs
  .command({
    command: 'install <packages...>',
    aliases: ['i'],
    desc: 'Install dependencies used in the pre and post tests',
    handler: ({ packages }) => conf.findConfig()
      .then(() => pack.install(packages))
      .then(packages => conf.updateDependencies(packages))
      .catch(console.error),
  })


/**
 * Initialize Pijin in the current directory.
 * Creates a `pijin.json` file in the current directory.
 */
yargs
  .command({
    command: 'init',
    desc: 'Initialize Pijin in the current directory',
    handler: () => init.initialize(process.cwd())
      .catch(console.error),
  })


/**
 * Generate help and output argv
 */
yargs
  .help('help')
  .alias('help', 'h')


/**
 * On fail, print generic error and dump the error as well
 */
yargs
  .fail((message, err) => console.error(
    'Oops... something went wrong!',
    message,
    err
  ))

/**
 * Print out the arguments
 */
if (yargs.argv.output) console.log(yargs.argv.output)
