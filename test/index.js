// @flow

import loadConfig from '../src/index.js'
import assert from 'assert'

assert.deepEqual(
  loadConfig({
    vars: {
      STR: {type: 'string', value: 'foo'},
      NUM: {type: 'number', value: 1},
      BOOL: {type: 'boolean', value: false},
    },
    envPrefix: 'TEST',
    mockEnv: {
      TEST_STR: 'foobar',
      TEST_NUM: '42',
      TEST_BOOL: 'true',
    },
  }),
  {
    TEST_STR: 'foobar',
    TEST_NUM: 42,
    TEST_BOOL: true,
  }
)

assert.deepEqual(
  loadConfig({
    vars: {
      STR: {type: 'string', value: 'foo'},
      NUM: {type: 'number', value: 1},
      BOOL: {type: 'boolean', value: false},
    },
    mockEnv: {},
  }),
  {
    STR: 'foo',
    NUM: 1,
    BOOL: false,
  }
)

assert.throws(() => {
  loadConfig({
    vars: {
      TEST: {type: 'boolean', required: true},
    },
    mockEnv: {},
  })
})

console.log('All tests passed successfully!')
