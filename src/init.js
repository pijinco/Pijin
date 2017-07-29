'use strict'

const path = require('path')
const Conf = require('./conf')

const {
  FileExistsException,
} = require('./exceptions')

const configFileName = 'pijin.json'
const workDirName = 'pijin'


const defaultDependencies = {
  conf: Conf(),
  path,
}

module.exports = function Init ({ conf, path } = defaultDependencies) {
  /**
   * Initialize Pijin in the given directory with the passed default configuration.
   *
   * @param {string} dir - The directory where Pijin should be initialized.
   * @returns {Promise.<string[]>} a promise that returns and object with the path to the config file and the working directory.
   */
  async function initialize (dir) {
    try {
      await createWorkspace(dir)
      console.log('Pijin initilized :)')
    } catch (error) {
      if (error.is(FileExistsException)) {
        console.log('Pijin is already initialized :)')
      } else {
        console.error('There was a problem doing the thing :(')
      }
    }
  }


  /**
   * createWorkspace
   *
   * @param {Object} config - The configuruation object to serialize into the config file.
   * @param {string} filename - The filename of the Pijin (only pijin.json default is supported).
   * @param {string} dirname - The name of the Work Directiry (only pijin default is supported).
   * @returns {undefined}
   */
  async function createWorkspace (dir, filename = configFileName, dirname = workDirName) {
    const configFilePath = path.resolve(dir, filename)
    const workDirPath = path.resolve(dir, workDirName)

    try {
      await Promise.all([
        conf.writeConfigFile(configFilePath),
        conf.createWorkingDirectory(workDirPath),
      ])

      return {
        configFilePath,
        workDirPath,
      }
    } catch (error) {
      // TODO log this
      throw error
    }
  }


  return {
    initialize,
    createWorkspace,
  }
}

