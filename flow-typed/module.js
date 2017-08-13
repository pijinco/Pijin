// @flow

declare module 'module' {
  declare class Module {
    constructor (path: string): Module,

    static _nodeModulePaths (path: string): string[],
    static _load (path: string, context: Module, isMain: boolean): Object,

    exports: string,
    paths: string[],
    _cache: Object,
  }

  declare export default typeof Module
}
