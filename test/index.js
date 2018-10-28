const {config} = require('../lib/index.js')
const assert = require('assert')

console.log('Throws on wrong option name format')
assert.throws(() => {
  config()
    .options({
      testOpt: {type: 'string'},
    })
    .parse({env: {}, args: []})
})

console.log('Throws on missing required option')
assert.throws(() => {
  config()
    .options({
      TEST: {type: 'list', required: true},
    })
    .parse({env: {}, args: []})
})

// console.log('Unset optional list should result in empty array')
// assert.deepEqual(
//   config()
//     .options({
//       TEST: {type: 'list'},
//     })
//     .parse({env: {}, args: []}),
//   {
//     _: [],
//     TEST: [],
//   },
// )

// console.log('Unset optional map should result in empty object')
// assert.deepEqual(
//   config()
//     .options({
//       TEST: {type: 'map'},
//     })
//     .parse({env: {}, args: []}),
//   {
//     _: [],
//     TEST: {},
//   },
// )

require('./config.js')
require('./env.js')
require('./args.js')

console.log('Arguments overwrite environment and config')
assert.deepEqual(
  config()
    .options({
      STR_OPT: {type: 'string'},
      NUM_OPT: {type: 'number', short: 'n'},
      LIST_OPT: {type: 'list'},
    })
    .parse({
      env: {STR_OPT: 'a', NUM_OPT: '1', LIST_OPT: 'x'},
      args: ['--num-opt', '2'],
      config: {list_opt: ['0']},
    }),
  {
    _: [],
    STR_OPT: 'a',
    NUM_OPT: '2',
    LIST_OPT: ['x'],
  },
)

console.log('Tests passed successfully 🎉')
