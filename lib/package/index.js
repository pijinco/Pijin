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
  npm.load({
    v: true,
  }, error => {
    if (error) throw (console.error(error), error)

    pj('lodash')
      .then(console.log)
  })
}


module.exports = {
  install,
}
