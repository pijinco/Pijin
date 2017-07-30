// @flow

declare module 'find-up' {
  declare type FindUp = (filename: string) => Promise<string>
  declare var exports: FindUp
}
