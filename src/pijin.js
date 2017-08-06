// @flow

import path from 'path'
import Conf, { type PijinConfig } from './conf'
import PackageManager from './package'

const {
  FileExistsException,
} = require('./exceptions')

const configFileName = 'pijin.json'
const workDirName = 'pijin'


type Dependencies = {
  conf: Conf,
  pack: PackageManager,
  path: {
    resolve: (...string[]) => string,
  },
}


export default class Pijin {
  conf: Conf
  pack: PackageManager
  path: { resolve: (...string[]) => string }


  static new (dependencies?: Dependencies): Pijin {
    return new Pijin({
      conf: Conf.new(),
      pack: PackageManager.new(),
      path,
      ...dependencies,
    })
  }


  constructor ({ conf, pack, path }: Dependencies) {
    this.conf = conf
    this.pack = pack
    this.path = path
  }

  /**
   * Initialize Pijin in the given directory with the passed default configuration.
   */
  async initialize (dir: string): Promise<mixed> {
    try {
      await this.createWorkspace(dir)
      console.log('Pijin initilized :)')
    } catch (error) {
      if (error.is(FileExistsException)) {
        console.log('Pijin is already initialized :)')
      } else {
        console.error('There was a problem doing the thing :(')
      }
    }
  }


  async run (config: PijinConfig) {
    const installablePackageNames = Object.keys(config.dependencies)
      .map(packageName => `${packageName}@${config.dependencies[packageName]}`)

    await this.pack.install(installablePackageNames)
  }

  /**
   * Create the workspace for Pijin in the specified directory with the
   * specified filename for the config file and directory name for the project.
   */
  async createWorkspace (dir: string, filename: string = configFileName, dirname: string = workDirName) {
    const configFilePath = this.path.resolve(dir, filename)
    const workDirPath = this.path.resolve(dir, workDirName)

    await Promise.all([
      this.conf.writeConfigFile(configFilePath),
      this.conf.createWorkingDirectory(workDirPath),
    ])

    return {
      configFilePath,
      workDirPath,
    }
  }
}
