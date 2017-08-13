// @flow

import vm from 'vm'
import path from 'path'

import Mod from './mod'

type Dependencies = {
  vm: typeof vm,
  mod: Mod,
  path: typeof path,
}

export default class Evil {
  vm: typeof vm
  mod: Mod
  path: typeof path

  static new (dependencies?: Dependencies) {
    return new Evil({
      vm,
      mod: Mod.new(),
      path,
      ...dependencies,
    })
  }

  constructor ({ vm, mod, path }: Dependencies) {
    this.vm = vm
    this.mod = mod
    this.path = path
  }

  evalModule (code: string, context: Object, path: string): Function {
    const mod = this.mod.create(path)

    const sandbox = {
      module: mod,
      exports: mod.exports,
      console,
      context,
      require: file => this.mod.load(file, mod),
    }

    return this.vm.runInNewContext(code, sandbox)
  }
}
