'use strict';

const npm = require('npm')
const pj = require('package-json')


/**
 * Install packages
 *
 * @param {Object[]} packages
 * @returns {undefined}
 */
function install(packages) {
  return new Promise((resolve, reject) => {
    npm.load(err => {
      if (err) return reject(err)

      Promise
        .all(packages.map(pj))
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
 * npmInstallPromisify
 *
 * @param p
 * @returns {undefined}
 */
function npmInstallPromisify(p) {
  return new Promise((resolve, reject) => {
    npm.install(p, err => {
      if (err) return reject(err)

      resolve(p)
    })
  })
}


module.exports = {
  install,
}
