'use strict'

const R = require('ramda')
const npmFetch = require('package-json')

const Npm = require('./npm')

const npmConfig = { loglevel: 'silent' }
const getInstallablePackageName = ({ name, version }) => `${name}@${version}`


const defaultDependencies = {
  npm: Npm(),
  npmFetch,
}

module.exports = function PackageManager ({ npm, npmFetch } = defaultDependencies) {
  /**
   * Install packages
   *
   * @returns {undefined}
   */
  const installPackages = R.pipe(
    R.map(getInstallablePackageName),
    R.apply(npm.install)
  )


  /**
   * Install NPM packages.
   *
   * @param {string[]} packages - An array of package names to install
   * @returns {Promise.<Object[]>} The array of npm package details
   */
  async function install (packages) {
    try {
      await npm.load(npmConfig)

      const packageDetails = await Promise.all(packages.map(npmFetch))

      await installPackages(packageDetails)

      return packageDetails
    } catch (error) {
      // TODO consider handling here
      throw error
    }
  }


  return {
    getInstallablePackageName,
    install,
    installPackages,
  }
}
