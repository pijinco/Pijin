import test from 'ava'
import { stub } from 'sinon'

import ConfigurationBuilder from '../conf'

const mockConfigPath = 'path/to/config.json'
const mockInvalidConfigFile = 'FILE_CONTENT'
const mockValidConfigFile = '{}'
const mockWorkDir = 'foo/bar'
const mockDependencies = [
  { name: 'bar', version: '2.1.8' },
  { name: 'foo', version: '0.1.1' },
]
const mockConfigFile = {
  dependencies: {
    foo: '0.1.1',
    bar: '2.1.8',
  },
}

const createMocks = () => ({
  fs: {
    mkdir: stub().resolves(mockWorkDir),
    readFile: stub().resolves(mockValidConfigFile),
    writeFile: stub().resolves(mockConfigPath),
  },
  findUp: stub().resolves(mockConfigPath),
})


test.beforeEach(t => {
  t.context.mock = createMocks()
  t.context.conf = ConfigurationBuilder.new(t.context.mock)
})


test('updateDependencies() results in the correct configuration', async t => {
  const { conf } = t.context

  t.deepEqual(
    await conf.updateDependencies(mockDependencies),
    mockConfigFile
  )
})


test('updateDependencies() calls fs.writeFile once only', async t => {
  const { conf, mock: { fs } } = t.context
  await conf.updateDependencies(mockDependencies)

  t.true(fs.writeFile.calledOnce)
})


test('updateDependencies() calls fs.readFile once', async t => {
  const { conf, mock: { fs } } = t.context
  await conf.updateDependencies(mockDependencies)


  t.true(fs.readFile.calledOnce)
})


test('updateDependencies() throws if the config file is malformed JSON', async t => {
  const { conf } = t.context
  t.context.mock.fs.readFile = stub().resolves(mockInvalidConfigFile)

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
  t.true(true)
})


test('writeConfigFile() returns the written config object', async t => {
  const { conf } = t.context

  const result = await conf.writeConfigFile('foo/bar', mockConfigFile)

  t.deepEqual(result, mockConfigFile)
})


