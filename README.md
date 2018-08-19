# any-cfg

[![Build Status](https://travis-ci.org/phaux/node-any-cfg.svg?branch=master)](https://travis-ci.org/phaux/node-any-cfg)

Read program options from environment variables and command line arguments.

## Example

Given following program:

```js
const {parse} = require('any-cfg')

const {
  HOST = '0.0.0.0',
  PORT = 80,
  DEBUG,
  _: [ROOT = '.'], // rest arguments from command line
} = parse({
  envPrefix: 'APP_',
  options: {
    HOST: {type: 'string', short: 'h'},
    PORT: {type: 'number', short: 'p'},
    DEBUG: {type: 'boolean'},
  },
})

```

Executing it as:

```bash
export APP_PORT=3000
your-app -h localhost /var/www
```

Would give following results:

```js
assert.equal(HOST, 'localhost')
assert.equal(PORT, 3000)
assert.equal(DEBUG, undefined)
assert.equal(ROOT, '/var/www')
```

## TODOs

- [x] Load config from env vars
- [x] Load config from command line args
- [x] Load config from JSON files
- [ ] Generate help message
