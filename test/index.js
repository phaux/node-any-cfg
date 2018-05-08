const {load} = require('../lib/index.js')
const assert = require('assert')

console.log('Throws on wrong option name format')
assert.throws(() => {
  load({
    options: {
      testOpt: {type: 'string'},
    },
    _mockEnv: {},
    _mockArgs: [],
  })
})

require('./env.js')
require('./args.js')

console.log('Arguments overwrite environment')
assert.deepEqual(
  load({
    options: {
      STR_OPT: {type: 'string'},
      NUM_OPT: {type: 'number', short: 'n'},
    },
    _mockEnv: {STR_OPT: 'a', NUM_OPT: '1'},
    _mockArgs: ['--num-opt', '2'],
  }),
  {
    rest: [],
    results: {
      STR_OPT: 'a',
      NUM_OPT: '2',
    },
  },
)

console.log('Tests passed successfully 🎉')
