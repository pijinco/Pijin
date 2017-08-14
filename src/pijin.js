// @flow

import Conf from './conf'
import PackageManager from './package'
import path from 'path'
import TestRunner from './runner/test-runner'

import { FileExistsException } from './exceptions'

const configFileName = 'pijin.json'
const workDirName = 'pijin'


const requiredDependencies = {
  'babel-plugin-transform-object-rest-spread': '6.23.0',
  'babel-plugin-transform-runtime': '6.23.0',
  'babel-preset-env': '1.6.0',
  'babel-register': '6.24.1',
}


export function createInstallablePackageName ([name, version]: [string, mixed]) {
  if (typeof version !== 'string') {
    version = 'latest'
  }

  return `${name}@${version}`
}


type Dependencies = {
  conf: Conf,
  pack: PackageManager,
  path: {
    resolve: (...string[]) => string,
  },
  testRunner: TestRunner,
}


export default class Pijin {
  conf: Conf
  pack: PackageManager
  path: { resolve: (...string[]) => string }
  testRunner: TestRunner


  static new (dependencies?: Dependencies): Pijin {
    return new Pijin({
      conf: Conf.new(),
      pack: PackageManager.new(),
      path,
      testRunner: TestRunner.new(),
      ...dependencies,
    })
  }


  constructor ({ conf, pack, path, testRunner }: Dependencies) {
    this.conf = conf
    this.pack = pack
    this.path = path
    this.testRunner = testRunner
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
        process.exit(1)
      }
    }
  }


  async install () {
    try {
      const { config } = await this.conf.loadConfig()

      const installablePackageNames = Object
        .entries({ ...requiredDependencies, ...config.dependencies })
        .map(createInstallablePackageName)

      await this.pack.install(installablePackageNames)
    } catch (error) {
      console.error('Unable to install dependencies', error)
      process.exit(1)
    }
  }


  async run (dir: string) {
    try {
      console.log('Running tests...')

      const workDirPath = path.resolve(dir, workDirName)
      await this.testRunner.load(workDirPath)
    } catch (error) {
      // TODO error handling strategies for if tests fail?
      console.error('Something went wrong', error)
      process.exit(1)
    }
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
