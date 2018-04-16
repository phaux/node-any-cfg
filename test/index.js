const {loadConfig} = require('../index.js')
const assert = require('assert')

console.log('Loads config from env vars')
assert.deepEqual(
  loadConfig({
    vars: {
      STR: {type: 'string'},
      NUM: {type: 'number'},
      BOOL: {type: 'boolean'},
    },
    _mockEnv: {
      NUM: '42',
      BOOL: 'off',
    },
  }),
  {
    NUM: 42,
    BOOL: false,
  }
)

console.log('Loads config from env with envPrefix')
assert.deepEqual(
  loadConfig({
    vars: {
      STR: {type: 'string'},
      NUM: {type: 'number'},
      BOOL: {type: 'boolean'},
    },
    envPrefix: 'TEST_',
    _mockEnv: {
      TEST_STR: 'foobar',
      TEST_NUM: '0.5',
      TEST_BOOL: 'true',
    },
  }),
  {
    STR: 'foobar',
    NUM: 0.5,
    BOOL: true,
  }
)

console.log('Throws when no required boolean env var set')
assert.throws(() => {
  loadConfig({
    vars: {
      TEST: {type: 'boolean', required: true},
    },
    _mockEnv: {},
  })
})

console.log('Throws on invalid boolean value')
assert.throws(() => {
  loadConfig({
    vars: {
      TEST: {type: 'boolean'},
    },
    _mockEnv: {
      TEST: 'truee',
    },
  })
})

console.log('Throws on invalid numeric value')
assert.throws(() => {
  loadConfig({
    vars: {
      TEST: {type: 'number'},
    },
    _mockEnv: {
      TEST: '1234a',
    },
  })
})

console.log('Tests passed successfully 🎉')
