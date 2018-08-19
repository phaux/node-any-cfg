const {parse} = require('../lib/index.js')
const assert = require('assert')

console.log('# Testing loading from evironment variables')

console.log('Loads options')
assert.deepEqual(
  parse({
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
    _: [],
    NUM: 42,
    BOOL: false,
  }
)

console.log('Loads list option')
assert.deepEqual(
  parse({
    options: {
      FOO: {type: 'list'},
    },
    _mockEnv: {
      FOO: 'foo,bar,42',
    },
    _mockArgs: [],
  }),
  {
    _: [],
    FOO: ['foo', 'bar', '42'],
  }
)

console.log('Loads map option')
assert.deepEqual(
  parse({
    options: {
      FOO: {type: 'map'},
    },
    _mockEnv: {
      FOO: 'foo=bar,42=24',
    },
    _mockArgs: [],
  }),
  {
    _: [],
    FOO: {'foo': 'bar', '42': '24'},
  }
)

console.log('Allows empty keys and values in map')
assert.deepEqual(
  parse({
    options: {
      FOO: {type: 'map'},
    },
    _mockEnv: {
      FOO: 'a=b,=',
    },
    _mockArgs: [],
  }),
  {
    _: [],
    FOO: {'a': 'b', '': ''},
  }
)

console.log('Throws on map key with no value')
assert.throws(() =>
  parse({
    options: {
      FOO: {type: 'map'},
    },
    _mockEnv: {
      FOO: 'a=b,c',
    },
    _mockArgs: [],
  })
)

console.log('Loads options with envPrefix')
assert.deepEqual(
  parse({
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
    _: [],
    STR: 'foobar',
    NUM: 0.5,
    BOOL: true,
  }
)

console.log('Throws on invalid boolean value')
assert.throws(() => {
  parse({
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
  parse({
    options: {
      TEST: {type: 'number'},
    },
    _mockEnv: {
      TEST: '1234a',
    },
    _mockArgs: [],
  })
})
