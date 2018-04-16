const {loadConfig} = require('../index.js')
const assert = require('assert')

assert.deepEqual(
  loadConfig({
    vars: {
      STR: {type: 'string', value: 'foo'},
      NUM: {type: 'number', value: 1},
      BOOL: {type: 'boolean', value: false},
    },
    envPrefix: 'TEST',
    _mockEnv: {
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
    _mockEnv: {},
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
    _mockEnv: {},
  })
})

assert.throws(() => {
  loadConfig({
    vars: {
      TEST: {type: 'boolean', required: true},
    },
    _mockEnv: {
      TEST: 'truee',
    },
  })
})

console.log('Tests passed successfully 🎉')
