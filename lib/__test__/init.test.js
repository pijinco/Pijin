'use strict'

const test = require('ava')
const sinon = require('sinon')
const Init = require('../init')

const mockConfigFile = {
  dependencies: {
    foo: '^0.1.1',
    bar: '^2.1.8',
  },
}

test.beforeEach(t => {
  t.context.mockConf = {
    writeConfigFile: x => x,
    createWorkingDirectory: x => x,
  }

  t.context.mockPath = {
    resolve: x => x
  }

  t.context.init = Init({
    conf: t.context.mockConf,
    path: t.context.mockPath,
  })
})

test('should resolve the workdir path and config file path', async t => {
  const result = await t.context.init.createWorkspace('foo', 'pijin.test', 'pijin')

  t.deepEqual(result, {
    configFilePath: 'foo',
    workDirPath: 'foo',
  })
})
