// @flow

import R from 'ramda'

import TestFile from './test-file'

export const StepTypes = {
  settings: 'settings',
  body: 'body',
  before: 'before',
  request: 'request',
  after: 'after',
}

const StepOrder = [
  StepTypes.settings,
  StepTypes.body,
  StepTypes.before,
  StepTypes.request,
  StepTypes.after,
]

type Step = $Keys<typeof StepTypes>

export type RunStep = {
  type: Step,
  data: Function | Object
}

export type TestConfiguration = {
  url: string,
  method: string,
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

  async load (workDirPath: string) {
    const testFiles = await this.testFile.getFiles(workDirPath)

    for (const testFile of testFiles) {
      await this.run(testFile)
    }
  }

  async run (steps: RunStep[]) {
    const context = {}

    for (const [ index, step ] of steps.entries()) {
      const nextStep = steps[index + 1]

      if (nextStep == null || StepOrder.indexOf(step.type) >= StepOrder.indexOf(StepTypes.request)) {
        await this.doStep({ type: StepTypes.request, data: {} }, context)
      }

      await this.doStep(step, context)
    }
  }

  async doStep (step: RunStep, context: Object) {
    const stepHandlers = {
      [StepTypes.settings]: stepSettings,
      [StepTypes.body]: stepBody,
      [StepTypes.request]: stepRequest,
      [StepTypes.before]: stepBefore,
      [StepTypes.after]: stepAfter,
    }

    const handler = R.pathOr(
      (...args) => console.log('DEFAULT', ...args),
      [step.type],
      stepHandlers
    )

    return handler(step.data, context)
  }
}

function stepSettings (data, context) {
  console.log('SETTINGS')
  context.settings = data
}

function stepBody (data, context) {
  console.log('BODY')
  if (context.body === 'raw') {
    context.body = data
  }
}

function stepBefore (data, context) {
  console.log('BEFORE')
  context.before = data
}

function stepAfter (data, context) {
  console.log('AFTER')
  context.after = data
}

function stepRequest (data, context) {
  console.log('REQUESTING')
}
