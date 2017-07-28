'use strict'

const npm = require('npm')


const defaultDependencies = {
  npm,
}

module.exports = function Npm ({ npm } = defaultDependencies) {
  /**
   * Installs an NPM package and returns a promise that resolves on completion
   * or throws if there are any errors during installation.
   *
   * @param {string} packageName - The name of the package to install
   * @returns {Promise.<string>} A promise that resolves with the name of the package
   */
  function install (...args) {
    return new Promise((resolve, reject) => {
      npm.install(...args, err =>
        err ? reject(err) : resolve(args)
      )
    })
  }


  /**
   * load
   *
   * @param config
   * @returns {undefined}
   */
  function load (config) {
    return new Promise((resolve, reject) => {
      npm.load(config, err =>
        err ? reject(err) : resolve()
      )
    })
  }


  return {
    install,
    load,
  }
}
