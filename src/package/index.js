// @flow

import Npm from './npm'

import {
  InvalidArgumentException,
} from '../exceptions'

const npmConfig = { loglevel: 'silent' }
const semVerRegex = new RegExp('^([\\w-]+)(?:@(.+))?$')


export function parseVersion (packageName: string): { name: string, version: string } {
  if (!semVerRegex.test(packageName)) {
    throw InvalidArgumentException({ packageName })
  }

  const [, name, version = 'latest'] = packageName.match(semVerRegex) || []

  return {
    name,
    version,
  }
}


type Dependencies = {
  npm: Npm,
}

export default class PackageManager {
  npm: Npm

  static new (dependencies?: Dependencies): PackageManager {
    return new PackageManager({
      npm: Npm.new(),
      ...dependencies,
    })
  }

  constructor ({ npm }: Dependencies) {
    this.npm = npm
  }

  async install (packages: string[]) {
    try {
      await this.npm.load(npmConfig)

      const packageDetails = await Promise.all(
        packages.map(parseVersion)
          .map(({ name, version }) => this.npm.getRemoteInfo(name, version))
      )

      await this.npm.install(...packageDetails.map(x => x.name))

      return packageDetails
    } catch (error) {
      // TODO logging
      throw error
    }
  }
}

