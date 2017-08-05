// @flow

import yargs from 'yargs'

import Conf from './conf'
import Pack from './package'

import Pijin from './pijin'

const pijin = Pijin.new()
const conf = Conf.new()
const pack = Pack.new()


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
 * Install dependencies used in the pre and post test scripts
 */
yargs
  .command({
    command: 'run',
    desc: 'Run the API tests',
    handler: () => conf.loadConfig()
      .then(({ config }) => pijin.run(config))
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
    handler: () => pijin.initialize(process.cwd())
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
