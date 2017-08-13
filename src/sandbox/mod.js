// @flow

import Module from 'module'

type Dependencies = {
  NodeModule: typeof Module,
}

export default class Mod {
  NodeModule: typeof Module

  static new (dependencies?: Dependencies) {
    return new Mod({
      NodeModule: Module,
      ...dependencies,
    })
  }

  constructor ({ NodeModule }: Dependencies) {
    this.NodeModule = NodeModule
  }

  create (contextPath: string): Module {
    const m = new this.NodeModule(contextPath)
    m.paths = this.NodeModule._nodeModulePaths(contextPath)
    m._cache = {}
    return m
  }

  load (file: string, NodeModuleInstance: Module) {
    return this.NodeModule._load(file, NodeModuleInstance, false)
  }
}
