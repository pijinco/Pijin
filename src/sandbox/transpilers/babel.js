// @flow

import { transform, type BabelResult } from 'babel-core'

import { type Transpiler } from './interface'


export class BabelTranspiler implements Transpiler {
  transform: *

  constructor (transform: (string, options?: Object) => BabelResult) {
    this.transform = transform
  }

  transpile (src: string): string {
    const { code } = this.transform(src, {
      presets: [
        ['env', {
          targets: { node: 'current' },
        }],
      ],
      babelrc: false,
    })

    return code
  }
}


export default new BabelTranspiler(transform)
