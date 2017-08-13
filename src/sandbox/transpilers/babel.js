// @flow

import { transform, type BabelResult } from 'babel-core'

import { type Transpiler } from './interface'

type Dependencies = {
  transform: (string, options?: Object) => BabelResult,
}

export default class BabelTranspiler implements Transpiler {
  transform: *

  static new (dependencies?: Dependencies) {
    return new BabelTranspiler({
      transform: transform,
      ...dependencies,
    })
  }

  constructor ({ transform }: Dependencies) {
    this.transform = transform
  }

  transpile (src: string, contextPath: string = '/Users/tom/Code/pijinco/Pijin'): string {
    const { code } = this.transform(src, {
      presets: [
        ['env', {
          targets: { node: 'current' },
        }],
      ],
      babelrc: false,
      generatorOpts: {
        dirname: contextPath,
      },
    })


    return code
  }
}

