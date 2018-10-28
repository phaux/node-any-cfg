const {config} = require('../lib/index.js')
const assert = require('assert')

console.log('# Testing loading from command line arguments')

console.log('Loads options')
assert.deepEqual(
  config()
    .options({
      STR_OPT: {type: 'string'},
      NUM_OPT: {type: 'number'},
      BOOL_OPT: {type: 'boolean'},
    }).parse({
      env: {},
      args: ['--num-opt', '42', '--str-opt', 'foo'],
    }),
  {
    _: [],
    NUM_OPT: 42,
    STR_OPT: 'foo',
  },
)

console.log('Loads rest options')
assert.deepEqual(
  config()
    .options({
      TEST: {type: 'number'},
    }).parse({
      env: {},
      args: ['foo', '--test', '123', 'bar', '--', '--baz'],
    }),
  {
    _: ['foo', 'bar', '--baz'],
    TEST: 123,
  },
)

console.log('Loads list option')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'list'},
    }).parse({
      args: ['--foo', 'bar', '--foo', '42'],
    }),
  {
    _: [],
    FOO: ['bar', '42'],
  },
)

console.log('Loads map option')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'map'},
    }).parse({
      env: {},
      args: ['--foo', 'foo=bar', '--foo', '42=24'],
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
      env: {},
      args: ['--foo', '='],
    }),
  {
    _: [],
    FOO: {'': ''},
  },
)

console.log('Throws on map key with no value')
assert.throws(() =>
  config()
    .options({
      FOO: {type: 'map'},
    }).parse({
      env: {},
      args: ['--foo', 'bar'],
    }),
)

console.log('Loads boolean options')
assert.deepEqual(
  config()
    .options({
      OPT_A: {type: 'boolean'},
      OPT_B: {type: 'boolean'},
      OPT_C: {type: 'boolean'},
    }).parse({
      env: {},
      args: ['--opt-a', '--no-opt-b'],
    }),
  {
    _: [],
    OPT_A: true,
    OPT_B: false,
  },
)

console.log('Long negated boolean arg takes precedence')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'boolean'},
      NO_FOO: {type: 'string'},
    }).parse({
      env: {},
      args: ['--no-foo'],
    }),
  {
    _: [],
    FOO: false,
  },
)

console.log('Loads short options')
assert.deepEqual(
  config()
    .options({
      BOOL_OPT: {type: 'boolean', short: 'b'},
      NUM_OPT: {type: 'number', short: 'n'},
    }).parse({
      env: {},
      args: ['-bn', '123'],
    }),
  {
    _: [],
    BOOL_OPT: true,
    NUM_OPT: 123,
  },
)

console.log('Throws on valueless short option')
assert.throws(() =>
  config()
    .options({
      BOOL_OPT: {type: 'boolean', short: 'b'},
      NUM_OPT: {type: 'number', short: 'n'},
    }).parse({
      env: {},
      args: ['-nb', '123'],
    }),
)

console.log('Throws on unknown arg')
assert.throws(() => {
  config()
    .options({
      TEST: {type: 'number'},
    }).parse({
      env: {},
      args: ['--nope', '1'],
    })
})

console.log('Throws on missing arg value')
assert.throws(() => {
  config()
    .options({
      TEST: {type: 'number'},
    }).parse({
      env: {},
      args: ['--test'],
    })
})

console.log('Throws on invalid numeric value')
assert.throws(() => {
  config()
    .options({
      TEST: {type: 'number'},
    }).parse({
      env: {},
      args: ['--test', '123a'],
    })
})
