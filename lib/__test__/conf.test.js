'use strict'

const test = require('ava')
const sinon = require('sinon')
const Configurator = require('../conf')

const mockConfigPath = 'path/to/config.json'
const mockFsConfig = () => ({
  fs: {
    writeFile: async (x) => {
      return x
    },
    readFile: async (x) => {
      return '{}'
    },
    mkdir: async (x) => {
      return x
    },
  },
  findUp: async () => mockConfigPath,
})
const mockDependencies = [
  { name: 'foo', version: '0.1.1' },
  { name: 'bar', version: '2.1.8' },
]
const mockConfigFile = {
  dependencies: {
    foo: '^0.1.1',
    bar: '^2.1.8',
  },
}


test.beforeEach(t => {
  t.context.mock = mockFsConfig()
  t.context.conf = Configurator(t.context.mock)
})


test('updateDependencies results in the correct configuration', async t => {
  t.deepEqual(
    await t.context.conf.updateDependencies(mockDependencies),
    mockConfigFile
  )
})


test('updateDependencies calls fs.writeFile once', async t => {
  const spy = sinon.spy(t.context.mock.fs, 'writeFile')
  await t.context.conf.updateDependencies(mockDependencies)
  t.true(spy.calledOnce)
})


test('updateDependencies calls fs.readFile once', async t => {
  const spy = sinon.spy(t.context.mock.fs, 'readFile')
  await t.context.conf.updateDependencies(mockDependencies)
  t.true(spy.calledOnce)
})
