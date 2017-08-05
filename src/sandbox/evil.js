// @flow

import vm from 'vm'

export class Evil {
  vm: *

  constructor (vm: *) {
    this.vm = vm
  }

  evalModule (code: string, contextPath?: string): Function {
    const m = new module.constructor()

    return vm.runInNewContext(code, {
      console,
      module: m,
      exports: m.exports,
      require,
    })
  }
}


export default new Evil(vm)
