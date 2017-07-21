'use strict'

const npm = require('npm')
const fetchNpmDetails = require('package-json')


/**
 * Install NPM packages.
 *
 * @param {string[]} packages - An array of package names to install
 * @returns {Promise.<Object[]>} The array of npm package details
 */
function install (packages) {
  return new Promise((resolve, reject) => {
    npm.load(err => {
      if (err) return reject(err)

      Promise
        .all(packages.map(fetchNpmDetails))
        .then(p => {
          const packs = p.map(({ name, version }) => `${name}@${version}`)
            .map(npmInstallPromisify)

          return Promise.all(packs)
            .then(() => p)
        })
        .then(resolve)
        .catch(reject)
    })
  })
}


/**
 * Installs an NPM package and returns a promise that resolves on completion
 * or throws if there are any errors during installation.
 *
 * @param {string} packageName - The name of the package to install
 * @returns {Promise.<string>} A promise that resolves with the name of the package
 */
function npmInstallPromisify (packageName) {
  return new Promise((resolve, reject) => {
    npm.install(packageName, err => {
      if (err) return reject(err)

      resolve(packageName)
    })
  })
}

module.exports = {
  install,
}
