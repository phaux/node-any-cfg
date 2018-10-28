const {config} = require('../lib/index.js')
const assert = require('assert')

console.log('# Testing loading from config files')

console.log('Finds config file')
assert.deepEqual(
  config({
    configDir: `${__dirname}/config`,
    configFile: 'foo',
  })
    .options({
      TEST_OPT: {type: 'string'},
    }).parse({
      env: {},
      args: [],
    }),
  {
    TEST_OPT: 'foo',
    _: [],
  },
)

console.log('Finds config file in parent folder')
assert.deepEqual(
  config({
    configDir: `${__dirname}/config`,
    configFile: 'bar',
  })
    .options({
      TEST_OPT: {type: 'number'},
    }).parse({
      env: {},
      args: [],
    }),
  {
    TEST_OPT: 42,
    _: [],
  },
)

console.log('Returns empty object when file not found')
assert.deepEqual(
  config({
    configDir: `${__dirname}/config`,
    configFile: 'baaaaaaaaaaaaaz',
  })
    .options({
      TEST_OPT: {type: 'number'},
    }).parse({
      env: {},
      args: [],
    }),
  {
    _: [],
  },
)

console.log('Loads list option')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'list'},
    }).parse({
      env: {},
      args: [],
      config: {
        foo: ['foo', 42, true],
      },
    }),
  {
    _: [],
    FOO: ['foo', '42', 'true'],
  },
)

console.log('Loads map option')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'map'},
    }).parse({
      env: {},
      args: [],
      config: {
        foo: {foo: 'bar', 42: 24},
      },
    }),
  {
    _: [],
    FOO: {foo: 'bar', 42: '24'},
  },
)

console.log('Throws on required but empty map')
assert.throws(() =>
  config()
    .options({
      FOO: {type: 'map', required: true},
    }).parse({
      env: {},
      args: [],
      config: {
        foo: {},
      },
    }),
)

console.log('Throws on on required but empty list')
assert.throws(() =>
  config()
    .options({
      FOO: {type: 'list', required: true},
    }).parse({
      env: {},
      args: [],
      config: {
        foo: [],
      },
    }),
)

console.log('Parses array as map')
assert.deepEqual(
  config()
    .options({
      FOO: {type: 'map'},
    }).parse({
      env: {},
      args: [],
      config: {
        foo: ['foo'],
      },
    }),
  {
    _: [],
    FOO: {0: 'foo'},
  },
)

console.log('Throws on invalid boolean value')
assert.throws(() => {
  config()
    .options({
      TEST: {type: 'boolean'},
    }).parse({
      env: {},
      args: [],
      config: {
        test: 'true',
      },
    })
})

console.log('Throws on invalid numeric value')
assert.throws(() => {
  config()
    .options({
      TEST: {type: 'number'},
    }).parse({
      env: {},
      args: [],
      config: {
        test: '42',
      },
    })
})
