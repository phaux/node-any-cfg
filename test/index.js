const {parse} = require('../lib/index.js')
const assert = require('assert')

console.log('Throws on wrong option name format')
assert.throws(() => {
  parse({
    options: {
      testOpt: {type: 'string'},
    },
    _mockEnv: {},
    _mockArgs: [],
  })
})

console.log('Throws on missing required option')
assert.throws(() => {
  parse({
    options: {
      TEST: {type: 'list', required: true},
    },
    _mockEnv: {},
    _mockArgs: [],
  })
})

console.log('Unset optional list should result in empty array')
assert.deepEqual(
  parse({
    options: {
      TEST: {type: 'list'},
    },
    _mockEnv: {},
    _mockArgs: [],
  }),
  {
    _: [],
    TEST: [],
  },
)

console.log('Unset optional map should result in empty object')
assert.deepEqual(
  parse({
    options: {
      TEST: {type: 'map'},
    },
    _mockEnv: {},
    _mockArgs: [],
  }),
  {
    _: [],
    TEST: {},
  },
)

require('./config.js')
require('./env.js')
require('./args.js')

console.log('Arguments overwrite environment and config')
assert.deepEqual(
  parse({
    options: {
      STR_OPT: {type: 'string'},
      NUM_OPT: {type: 'number', short: 'n'},
      LIST_OPT: {type: 'list'},
    },
    _mockEnv: {STR_OPT: 'a', NUM_OPT: '1', LIST_OPT: 'x'},
    _mockArgs: ['--num-opt', '2'],
    _mockConfig: {list_opt: ['0']},
  }),
  {
    _: [],
    STR_OPT: 'a',
    NUM_OPT: '2',
    LIST_OPT: ['x'],
  },
)

console.log('Tests passed successfully 🎉')
