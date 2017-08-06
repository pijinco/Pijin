// @flow


export const stepTypes = {
  'configure': 'configure',
  'body': 'body',
  'before-request': 'before-configure',
  'after-request': 'after-request',
}


type RunStep = {
  type: $Keys<typeof stepTypes>
}


export default class TestRunner {
  run (steps: RunStep[]) {
    console.log(steps)
  }
}
