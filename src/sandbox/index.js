// @flow

import BabelTranspiler from './transpilers/babel'
import { type Transpiler } from './transpilers/interface'
import Evil from './evil'

type Dependencies = {
  evil: Evil,
  transpiler: Transpiler,
}

export default class Sandbox {
  evil: Evil
  transpiler: Transpiler

  static new (dependencies?: Dependencies) {
    return new Sandbox({
      evil: Evil.new(),
      transpiler: BabelTranspiler.new(),
      ...dependencies,
    })
  }

  constructor ({ evil, transpiler }: Dependencies) {
    this.evil = evil
    this.transpiler = transpiler
  }

  run (src: string, context?: Object = {}) {
    const code = this.transpiler.transpile(src)

    const result = this.evil.evalModule(code, context, process.cwd())

    return result
  }
}
