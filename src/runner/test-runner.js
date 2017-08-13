// @flow

import TestFile from './test-file'

export const stepTypes = {
  'settings': 'settings',
  'body': 'body',
  'before-request': 'before-request',
  'after-request': 'after-request',
}

export type RunStep = {
  type: $Keys<typeof stepTypes>,
  data: Function | Object
}


type Dependencies = {
  testFile: TestFile
}

export default class TestRunner {
  testFile: TestFile

  static new (dependencies?: Dependencies) {
    return new TestRunner({
      testFile: TestFile.new(),
      ...dependencies,
    })
  }

  constructor ({ testFile }: Dependencies) {
    this.testFile = testFile
  }

  run (steps: RunStep[]) {
    // TODO implement running the tests
  }

  async load (workDirPath: string) {
    const testFiles = await this.testFile.getFiles(workDirPath)
    console.dir(testFiles, { depth: null })
  }
}
