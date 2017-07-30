// @flow

import npmFetch from 'package-json'

import Npm from './npm'

export type NpmPackage = {
  name: string,
  version: string,
}

const npmConfig = { loglevel: 'silent' }

const getInstallablePackageName = ({ name, version }: NpmPackage) => `${name}@${version}`


class PackageManager {
  npm: Npm
  npmFetch: Function

  constructor (npm: Npm, npmFetch: Function) {
    this.npm = npm
    this.npmFetch = npmFetch
  }

  /**
   * Install NPM packages.
   */
  async install (packages: string[]) {
    try {
      await this.npm.load(npmConfig)

      const packageDetails = await Promise.all(packages.map(npmFetch))

      await this.npm.install(
        ...packageDetails.map(getInstallablePackageName)
      )

      return packageDetails
    } catch (error) {
      // TODO consider handling here
      throw error
    }
  }
}


const D: {
  npm: Npm,
  npmFetch: Function,
} = {
  npm: Npm(),
  npmFetch,
}


export default ({ npm, npmFetch }: * = D) =>
  new PackageManager(npm, npmFetch)
