const {config} = require('../lib/index.js')
const assert = require('assert')

console.log('# Testing loading from evironment variables')

console.log('Loads options')
assert.deepEqual(
  config()
    .options({
      STR: {type: 'string'},
      NUM: {type: 'number'},
      BOOL: {type: 'boolean'},
    }).parse({
      env: {
        NUM: '42',
        BOOL: 'off',
      },
      args: [],
    }),
  {
    _: [],
    NUM: 42,
    BOOL: false,
  },
)

console.log('Loads list option')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'list'},
    }).parse({
      env: {
        FOO: 'foo,bar,42',
      },
      args: [],
    }),
  {
    _: [],
    FOO: ['foo', 'bar', '42'],
  },
)

console.log('Loads map option')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'map'},
    }).parse({
      env: {
        FOO: 'foo=bar,42=24',
      },
      args: [],
    }),
  {
    _: [],
    FOO: {foo: 'bar', 42: '24'},
  },
)

console.log('Allows empty keys and values in map')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'map'},
    }).parse({
      env: {
        FOO: 'a=b,=',
      },
      args: [],
    }),
  {
    _: [],
    FOO: {'a': 'b', '': ''},
  },
)

console.log('Throws on map key with no value')
assert.throws(() =>
  config()
    .options({
      FOO: {type: 'map'},
    }).parse({
      env: {
        FOO: 'a=b,c',
      },
      args: [],
    }),
)

console.log('Loads options with envPrefix')
assert.deepEqual(
  config({envPrefix: 'TEST_'})
    .options({
      STR: {type: 'string'},
      NUM: {type: 'number'},
      BOOL: {type: 'boolean'},
    }).parse({
      env: {
        TEST_STR: 'foobar',
        TEST_NUM: '0.5',
        TEST_BOOL: 'true',
      },
      args: [],
    }),
  {
    _: [],
    STR: 'foobar',
    NUM: 0.5,
    BOOL: true,
  },
)

console.log('Throws on invalid boolean value')
assert.throws(() => {
  config()
    .options({
      TEST: {type: 'boolean'},
    }).parse({
      env: {
        TEST: 'truee',
      },
      args: [],
    })
})

console.log('Throws on invalid numeric value')
assert.throws(() => {
  config()
    .options({
      TEST: {type: 'number'},
    }).parse({
      env: {
        TEST: '1234a',
      },
      args: [],
    })
})
