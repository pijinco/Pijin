'use strict'

const path = require('path')
const {
  createConfigFile,
  createWorkingDirectory,
} = require('./conf')

const configFileName = 'pijin.json'
const workDirName = 'pijin'


/**
 * Initialize Pijin in the given directory with the passed default configuration.
 *
 * @param {string} dir - The directory where Pijin should be initialized.
 * @param {Object} config - The configuruation object to serialize into the conig file.
 * @param {string} filename - The filename of the Pijin (only pijin.json default is supported).
 * @param {string} dirname - The name of the Work Directiry (only pijin default is supported).
 * @returns {Promise.<string[]>} a promise that returns an array with the path of the config and workdir.
 */
function init (dir, config, filename = configFileName, dirname = workDirName) {
  const configFilePath = path.resolve(dir, filename)
  const workDirPath = path.resolve(dir, workDirName)

  return Promise.all([
    createConfigFile(configFilePath, config),
    createWorkingDirectory(workDirPath),
  ])
}


module.exports = init
