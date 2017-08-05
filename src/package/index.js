// @flow

import Npm from './npm'

const npmConfig = { loglevel: 'silent' }

const verRegex = new RegExp('^([\\w-]+)(?:@(.+))?$')

export default class PackageManager {
  npm: *

  static new () {
    return new PackageManager(Npm.new())
  }

  constructor (npm: Npm) {
    this.npm = npm
  }

  parseVersion (packageName: string) {
    const [, name, version = 'latest'] = packageName.match(verRegex) || []

    return {
      name,
      version,
    }
  }

  async install (packages: string[]) {
    try {
      await this.npm.load(npmConfig)

      const packageDetails = await Promise.all(
        packages
          .map(packageName => this.parseVersion(packageName))
          .map(({ name, version }) => this.npm.getInfo(name, version))
      )

      await this.npm.install(...packageDetails.map(x => x.name))

      return packageDetails
    } catch (error) {
      // TODO logging
      throw error
    }
  }
}

