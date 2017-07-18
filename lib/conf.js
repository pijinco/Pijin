'use strict';

const fs = require('./io/file')
const findUp = require('find-up')

const defaultConfig = {
  // Config goes here
}


/**
 * updateDeps
 *
 * @param deps
 * @returns {undefined}
 */
function updateDependencies(deps) {
  // Load a list of dependencies similar to how npm does it by default with
  // the caret to only lock the major
  const nextDeps = deps
    .map(({ name, version }) => ({ [name]: `^${version}` }))
    .reduce((acc, next) => Object.assign(acc, next))

  // Load the configuration and write
  loadConfig()
    .then(({ config, mergeAndWriteKey }) =>
      mergeAndWriteKey('dependencies', nextDeps)
    )
}


// TODO extract exception
function ConfigExpired() {
  this.message = 'Config has expired'
}


/**
 * Create the Pijin configuation and write to file.
 *
 * @param {string} path The path of the pijin file
 * @param {Object} config The configuration object to marge with defaults
 * @returns {Promise.<Object>}
 */
function createConfigFile(path, config) {
  console.log(`Writing Pijin config file at ${path}`)

  const configFileContent = JSON.stringify(
    Object.assign(defaultConfig, config),
    null,
    2
  )

  return fs.writeFile(path, configFileContent)
}


/**
 * Create the working directory for Pijin. This folder is where all the test files
 * and packages will run.
 *
 * @param {string} path The path of the working directory folder
 * @returns {Promise.<Object>}
 */
function createWorkingDirectory(path) {
  console.log(`Creating Pijin working directory at ${path}`)

  return fs.mkdir(path)
}


/**
 * Search up for the config file and if found load the and resolve the config
 * and the path to the config as `{ config, path }`.
 *
 * @returns {Promise.<Object<config, path>>}
 */
function loadConfig() {
  return findUp('pijin.json')
    .then(path => {
      if (!path) throw new Error('Unable to find Pijin configuration file.')

      // This flag is here to see if we have already written to the config
      // file. This can be bypassed if absolutely required by calling the
      // create config file function directly
      let configIsDirty = false
      return fs.readFile(path)
        .then(JSON.parse)
        .then((config) => ({
          config,
          path,

          write: config => {
            if (configIsDirty) throw new ConfigExpired()
            configIsDirty = true
            return createConfigFile(path, config)
          },

          writeKey: (key, value) => {
            if (configIsDirty) throw new ConfigExpired()
            configIsDirty = true
            config[key] = value
            return createConfigFile(path, config)
          },

          mergeAndWriteKey: (key, value) => {
            if (configIsDirty) throw new ConfigExpired()
            configIsDirty = true
            config[key] = Object.assign(
              config[key] || {},
              value
            )
            return createConfigFile(path, config)
          }
        }))
    })
    .catch(console.error)

  // TODO: better error handling
}


module.exports = {
  updateDependencies,
  createConfigFile,
  createWorkingDirectory,
}
