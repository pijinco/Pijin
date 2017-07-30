'use strict'

import test from 'ava'
import sinon from 'sinon'
import ConfiguratorFactory from '../conf'

const mockConfigPath = 'path/to/config.json'

const mockDeps = () => ({
  fs: {
    mkdir: async x => x,
    readFile: async x => '{}',
    writeFile: async x => x,
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
  t.context.mock = mockDeps()
  t.context.conf = ConfiguratorFactory(t.context.mock)
})


test('updateDependencies() results in the correct configuration', async t => {
  const { conf } = t.context
  t.deepEqual(
    await conf.updateDependencies(mockDependencies),
    mockConfigFile
  )
})


test('updateDependencies() calls fs.writeFile once', async t => {
  const { conf, mock } = t.context
  const spy = sinon.spy(mock.fs, 'writeFile')

  await conf.updateDependencies(mockDependencies)

  t.true(spy.calledOnce)
})


test('updateDependencies() calls fs.readFile once', async t => {
  const { mock } = t.context
  const spy = sinon.spy(mock.fs, 'readFile')

  await t.context.conf.updateDependencies(mockDependencies)

  t.true(spy.calledOnce)
})


test('updateDependencies() throws if the config file is malformed JSON', async t => {
  const { conf, mock } = t.context
  mock.fs.readFile = async () => 'BAD-JSON'

  const error = await t.throws(
    conf.updateDependencies(mockDependencies)
  )

  t.true(error.message.startsWith('Unexpected token'))
})


test('writeConfigFile() throws if the config cannot be stringified', async t => {
  const { conf } = t.context

  const test1 = {}
  const test2 = { test1 }
  test1.test2 = test2

  await t.throws(conf.writeConfigFile('foo/bar', test1), TypeError)
})


test('writeConfigFile() calls fs.writeFile once', async t => {
  const { conf, mock } = t.context

  const spy = sinon.spy(mock.fs, 'writeFile')

  conf.writeConfigFile('foo/bar', {})

  t.true(spy.calledOnce)
})


test('writeConfigFile() returns the written config object', async t => {
  const { conf } = t.context

  const result = await conf.writeConfigFile('foo/bar', mockConfigFile)

  t.deepEqual(result, mockConfigFile)
})


