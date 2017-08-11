// @flow

import test from 'ava'

import { parseVersion } from '../'

test('parseVersion should parse the name@version string correctly', t => {
  t.deepEqual(
    parseVersion('lodash@12.34.5'),
    { name: 'lodash', version: '12.34.5' }
  )
})

test('parseVersion should parse the name@version string even if it has npm semver info', t => {
  t.deepEqual(
    parseVersion('lodash@^12.34.5'),
    { name: 'lodash', version: '^12.34.5' }
  )
})

test('version should be latest if not set', t => {
  t.deepEqual(
    parseVersion('ramda'),
    { name: 'ramda', version: 'latest' }
  )
})
