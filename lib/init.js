'use strict';

const fs = require('fs')
const path = require('path')

const defaultConfig = {
  // Config goes here
}

const configFileName = 'pijin.json'
const workDirName = 'pijin'

/**
 * init
 *
 * @param {string} dir The directory where Pijin should be initialized
 * @returns {undefined}
 */
function init(cwd, config, filename = configFileName, dirname = workDirName) {
  process.stdout.write('Initilizing Pijin...\n')

  Promise.all([
    createConfigFile(cwd, filename, config),
    createWorkingDirectory(cwd, dirname),
  ])
    .then(() => process.stdout.write('Pijin Initialized!\n'))
    .catch(e => process.stderr.write(e.message))
}


/**
 * Create the Pijin configuation file.
 *
 * @param {string} cwd The folder to create the config file in
 * @param {string} filename The filename of the pijin file
 * @param {Object} config The configuration object to marge with defaults
 * @returns {Promise.<Object>}
 */
function createConfigFile(cwd, filename, config) {
  const configFilePath = path.resolve(cwd, filename)
  const configFileContent = JSON.stringify(
    Object.assign(defaultConfig, config),
    null,
    2
  )

  return new Promise((resolve, reject) => {
    // TODO: check if file exists before writing
    fs.writeFile(configFilePath, configFileContent, err => {
      if (err) reject(err)

      resolve({
        path: configFilePath,
        content: configFileContent,
      })
    })
  })
}


/**
 * Create the working directory for Pijin. This folder is where all the test files
 * and packages will run.
 *
 * @param {string} cwd The folder to create the config file in
 * @param {string} dirname The name of the working directory folder
 * @returns {Promise.<Object>}
 */
function createWorkingDirectory(cwd, dirname) {
  const workDirPath = path.resolve(cwd, dirname)

  return new Promise((resolve, reject) => {
    fs.mkdir(workDirPath, err => {
      if (err) reject(err)

      resolve({ path: workDirPath })
    })
  })
}

module.exports = init
