import test from 'ava'
import { stub } from 'sinon'
import Pijin from '../pijin'

const createMocks = () => ({
  conf: {
    writeConfigFile: stub().resolves('FILE'),
    createWorkingDirectory: stub().resolves('DIR'),
  },
  pack: {
    install: stub().resolves('INSTALL'),
  },
  path: {
    resolve: stub().returns('PATH'),
  },
})


test.beforeEach(t => {
  t.context.mock = createMocks()
  t.context.pijin = new Pijin(t.context.mock)
})


test('should resolve the workdir path and config file path', async t => {
  const result = await t.context.pijin.createWorkspace('foo', 'pijin.test', 'pijin')

  t.deepEqual(result, {
    configFilePath: 'PATH',
    workDirPath: 'PATH',
  })
})

