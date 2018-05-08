const {load} = require('../lib/index.js')
const assert = require('assert')

console.log('# Testing loading from evironment variables')

console.log('Loads options')
assert.deepEqual(
  load({
    options: {
      STR: {type: 'string'},
      NUM: {type: 'number'},
      BOOL: {type: 'boolean'},
    },
    _mockEnv: {
      NUM: '42',
      BOOL: 'off',
    },
    _mockArgs: [],
  }),
  {
    rest: [],
    results: {
      NUM: 42,
      BOOL: false,
    },
  }
)

console.log('Loads options with envPrefix')
assert.deepEqual(
  load({
    envPrefix: 'TEST_',
    options: {
      STR: {type: 'string'},
      NUM: {type: 'number'},
      BOOL: {type: 'boolean'},
    },
    _mockEnv: {
      TEST_STR: 'foobar',
      TEST_NUM: '0.5',
      TEST_BOOL: 'true',
    },
    _mockArgs: [],
  }),
  {
    rest: [],
    results: {
      STR: 'foobar',
      NUM: 0.5,
      BOOL: true,
    },
  }
)

console.log('Throws on invalid boolean value')
assert.throws(() => {
  load({
    options: {
      TEST: {type: 'boolean'},
    },
    _mockEnv: {
      TEST: 'truee',
    },
    _mockArgs: [],
  })
})

console.log('Throws on invalid numeric value')
assert.throws(() => {
  load({
    options: {
      TEST: {type: 'number'},
    },
    _mockEnv: {
      TEST: '1234a',
    },
    _mockArgs: [],
  })
})
