const {parse} = require('../lib/index.js')
const assert = require('assert')

console.log('# Testing loading from config files')

console.log('Finds config file')
assert.deepEqual(
  parse({
    configDir: `${__dirname}/config`,
    configFile: 'foo',
    options: {
      TEST_OPT: {type: 'string'},
    },
    _mockEnv: {},
    _mockArgs: [],
  }),
  {
    TEST_OPT: 'foo',
    _: [],
  }
)

console.log('Finds config file in parent folder')
assert.deepEqual(
  parse({
    configDir: `${__dirname}/config`,
    configFile: 'bar',
    options: {
      TEST_OPT: {type: 'number'},
    },
    _mockEnv: {},
    _mockArgs: [],
  }),
  {
    TEST_OPT: 42,
    _: [],
  }
)

console.log('Returns empty object when file not found')
assert.deepEqual(
  parse({
    configDir: `${__dirname}/config`,
    configFile: 'baaaaaaaaaaaaaz',
    options: {
      TEST_OPT: {type: 'number'},
    },
    _mockEnv: {},
    _mockArgs: [],
  }),
  {
    _: [],
  }
)

console.log('Loads list option')
assert.deepEqual(
  parse({
    options: {
      FOO: {type: 'list'},
    },
    _mockEnv: {},
    _mockArgs: [],
    _mockConfig: {
      foo: ['foo', 42, true],
    },
  }),
  {
    _: [],
    FOO: ['foo', '42', 'true'],
  }
)

console.log('Loads map option')
assert.deepEqual(
  parse({
    options: {
      FOO: {type: 'map'},
    },
    _mockEnv: {},
    _mockArgs: [],
    _mockConfig: {
      foo: {foo: 'bar', 42: 24},
    },
  }),
  {
    _: [],
    FOO: {'foo': 'bar', '42': '24'},
  }
)

console.log('Throws on required but empty map')
assert.throws(() =>
  parse({
    options: {
      FOO: {type: 'map', required: true},
    },
    _mockEnv: {},
    _mockArgs: [],
    _mockConfig: {
      foo: {},
    },
  })
)

console.log('Throws on on required but empty list')
assert.throws(() =>
  parse({
    options: {
      FOO: {type: 'list', required: true},
    },
    _mockEnv: {},
    _mockArgs: [],
    _mockConfig: {
      foo: [],
    },
  })
)

console.log('Parses array as map')
assert.deepEqual(
  parse({
    options: {
      FOO: {type: 'map'},
    },
    _mockEnv: {},
    _mockArgs: [],
    _mockConfig: {
      foo: ['foo'],
    },
  }),
  {
    _: [],
    FOO: {0: 'foo'},
  }
)

console.log('Throws on invalid boolean value')
assert.throws(() => {
  parse({
    options: {
      TEST: {type: 'boolean'},
    },
    _mockEnv: {},
    _mockArgs: [],
    _mockConfig: {
      test: 'true',
    },
  })
})

console.log('Throws on invalid numeric value')
assert.throws(() => {
  parse({
    options: {
      TEST: {type: 'number'},
    },
    _mockEnv: {},
    _mockArgs: [],
    _mockConfig: {
      test: '42',
    },
  })
})
