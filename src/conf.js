// @flow

import findUp, { type FindUp } from 'find-up'
import fs, { type FileSystem } from './io/file'
import { type NpmPackage } from './package/npm'


import {
  ConfigurationExpiredException,
  FileNotFoundException,
} from './exceptions'


export type PijinConfig = {
  dependencies: Object,
  workdir?: string,
}


const defaultConfig: PijinConfig = {
  dependencies: {},
}


type Dependencies = {
  fs: FileSystem,
  findUp: typeof findUp,
}


export default class ConfigurationBuilder {
  fs: FileSystem
  findUp: FindUp

  static new (dependencies?: Dependencies) {
    return new ConfigurationBuilder({
      fs,
      findUp,
      ...dependencies,
    })
  }

  constructor ({ fs, findUp }: Dependencies) {
    this.fs = fs
    this.findUp = findUp
  }

  /**
   * Add the dependecies that are passed in to the configuration file under the
   * dependencies key.
   */
  async updateDependencies (dependencies: NpmPackage[]) {
    // Load a list of dependencies similar to how npm does it by default with
    // the caret to only lock the major
    const deps = dependencies
      .map(({ name, version }) => ({ [name]: `${version}` }))
      .reduce((acc, next) => Object.assign(acc, next))

    // Load the configuration and write
    const { config, write } = await this.loadConfigMut()

    config.dependencies = Object.assign(config.dependencies || {}, deps)

    return write(config)
  }


  /**
   * Create the Pijin configuation and write to file.
   */
  async writeConfigFile (path: string, config: PijinConfig = defaultConfig) {
    const nextConfig = Object.assign({}, defaultConfig, config)

    const configFileContent = JSON.stringify(
      nextConfig,
      null,
      2
    )

    await this.fs.writeFile(path, configFileContent)

    return nextConfig
  }


  /**
   * Create the working directory for Pijin. This folder is where all the test
   * files and packages will run.
   */
  async createWorkingDirectory (path: string): Promise<string> {
    console.log(`Creating Pijin working directory at ${path}`)

    return this.fs.mkdir(path)
  }


  /**
   * Search up for the config file and if found load the and resolve the config
   * and the path to the config as `{ config, path }`.
   */
  async loadConfig (): Promise<{ config: PijinConfig, path: string }> {
    const path = await this.findConfig()

    const configBuffer = await this.fs.readFile(path)

    const config: PijinConfig = JSON.parse(configBuffer.toString())

    return {
      config,
      path,
    }
  }


  /**
   * Same as loadConfig, except it Loads the config file and provides a write
   * method for writing back to the file once.
   */
  async loadConfigMut (): Promise<{ config: PijinConfig, path: string, write: (PijinConfig) => Promise<PijinConfig> }> {
    const { config, path } = await this.loadConfig()

    // This flag is here to see if we have already written to the config file.
    // This can be bypassed if absolutely required by calling the create config
    // file function directly
    let configIsDirty = false

    return {
      config,
      path,
      write: newConfig => {
        if (configIsDirty) throw ConfigurationExpiredException()
        configIsDirty = true
        return this.writeConfigFile(path, newConfig)
      },
    }
  }


  async findConfig (): Promise<string> {
    const filename = 'pijin.json'
    const path = await this.findUp(filename)

    if (!path) throw FileNotFoundException(filename)

    return path
  }
}

