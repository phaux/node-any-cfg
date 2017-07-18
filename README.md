# any-cfg

Load configs from environment variables.

## Example

```bash
export APP_PORT="3000"
export APP_DEBUG="true"
```

```js
const loadConfig = require('any-cfg')

const {HOST, PORT, DEBUG} = loadConfig({
  envPrefix: 'APP',
  vars: { // specify types and defaults
    HOST: {type: 'string', value: '0.0.0.0'},
    PORT: {type: 'number', value: 80},
    DEBUG: {type: 'boolean', value: false},
  }
})

const assert = require('assert')

assert.equal(HOST, '0.0.0.0')
assert.equal(PORT, 3000)
assert.equal(DEBUG, true)
```

## TODOs

- [ ] Load config from command line
- [ ] Load config from files
