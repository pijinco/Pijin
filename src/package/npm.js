// @flow

import npm from 'npm'
import packageJson from 'package-json'

export type NpmPackage = {
  name: string,
  version: string,
}

export default class Npm {
  npm: *
  packageJson: *

  static new () {
    return new Npm(npm, packageJson)
  }

  constructor (npm: *, packageJson: Function) {
    this.npm = npm
    this.packageJson = packageJson
  }

  install (...args: string[]) {
    return new Promise((resolve, reject) => {
      this.npm.install(...args, err =>
        err ? reject(err) : resolve(args)
      )
    })
  }

  load (config: Object) {
    return new Promise((resolve, reject) => {
      this.npm.load(config, err =>
        err ? reject(err) : resolve()
      )
    })
  }

  getInfo (packageName: string, version: string): Promise<NpmPackage> {
    return this.packageJson(packageName, { version })
  }
}
