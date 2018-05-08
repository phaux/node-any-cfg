const {load} = require('../lib/index.js')
const assert = require('assert')

console.log('# Testing loading from command line arguments')

console.log('Loads options')
assert.deepEqual(
  load({
    options: {
      STR_OPT: {type: 'string'},
      NUM_OPT: {type: 'number'},
      BOOL_OPT: {type: 'boolean'},
    },
    _mockEnv: {},
    _mockArgs: ['--num-opt', '42', '--str-opt', 'foo'],
  }),
  {
    rest: [],
    results: {
      NUM_OPT: 42,
      STR_OPT: 'foo',
    },
  }
)

console.log('Loads rest options')
assert.deepEqual(
  load({
    options: {
      TEST: {type: 'number'},
    },
    _mockEnv: {},
    _mockArgs: ['foo', '--test', '123', 'bar', '--', '--baz'],
  }),
  {
    rest: ['foo', 'bar', '--baz'],
    results: {
      TEST: 123,
    },
  }
)

console.log('Loads boolean options')
assert.deepEqual(
  load({
    options: {
      OPT_A: {type: 'boolean'},
      OPT_B: {type: 'boolean'},
      OPT_C: {type: 'boolean'},
    },
    _mockEnv: {},
    _mockArgs: ['--opt-a', '--no-opt-b'],
  }),
  {
    rest: [],
    results: {
      OPT_A: true,
      OPT_B: false,
    },
  }
)

console.log('Loads short options')
assert.deepEqual(
  load({
    options: {
      BOOL_OPT: {type: 'boolean', short: 'b'},
      NUM_OPT: {type: 'number', short: 'n'},
    },
    _mockEnv: {},
    _mockArgs: ['-bn', '123'],
  }),
  {
    rest: [],
    results: {
      BOOL_OPT: true,
      NUM_OPT: 123,
    },
  }
)

console.log('Throws on unknown arg')
assert.throws(() => {
  load({
    options: {
      TEST: {type: 'number'},
    },
    _mockEnv: {},
    _mockArgs: ['--nope', '1'],
  })
})

console.log('Throws on missing arg value')
assert.throws(() => {
  load({
    options: {
      TEST: {type: 'number'},
    },
    _mockEnv: {},
    _mockArgs: ['--test'],
  })
})

console.log('Throws on invalid numeric value')
assert.throws(() => {
  load({
    options: {
      TEST: {type: 'number'},
    },
    _mockEnv: {},
    _mockArgs: ['--test', '123a'],
  })
})
