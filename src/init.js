// @flow

import path from 'path'
import ConfigurationBuilderFactory, {
  type ConfigurationBuilder,
} from './conf'

const {
  FileExistsException,
} = require('./exceptions')

const configFileName = 'pijin.json'
const workDirName = 'pijin'


type Path = {
  resolve: (...args: string[]) => string,
}


class Pijin {
  conf: ConfigurationBuilder
  path: Path

  constructor (conf: ConfigurationBuilder, path: Path) {
    this.conf = conf
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


const D: {
  conf: ConfigurationBuilder,
  path: Path,
} = {
  conf: ConfigurationBuilderFactory(),
  path,
}


export default ({ conf, path }: * = D) =>
  new Pijin(conf, path)
