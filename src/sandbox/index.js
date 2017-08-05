// @flow

import transpiler from './transpilers/babel'
import { type Transpiler } from './transpilers/interface'
import evil, { type Evil } from './evil'


export class Sandbox {
  evil: *
  transpiler: *

  constructor (evil: Evil, transpiler: Transpiler) {
    this.evil = evil
    this.transpiler = transpiler
  }

  run (src: string, args: mixed[]) {
    const code = this.transpiler.transpile(src)

    const fn = this.evil.evalModule(code)

    return fn(...args)
  }
}

export default new Sandbox(evil, transpiler)
