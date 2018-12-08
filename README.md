# any-cfg

[![npm](https://img.shields.io/npm/v/any-cfg.svg)](https://www.npmjs.com/package/any-cfg)
[![Build Status](https://travis-ci.org/phaux/node-any-cfg.svg?branch=master)](https://travis-ci.org/phaux/node-any-cfg)

[CHANGELOG](CHANGELOG.md) |
[DOCUMENTATION](https://phaux.github.io/node-any-cfg/modules/_index_.html#config)

Read program options from config files, environment variables and command line arguments.

## Usage

```js
const {config} = require('any-cfg')

const cfg = config({
  configDir: '.',
  configFile: '.myapprc',
  envPrefix: 'MYAPP_',
})
.options({
  HOST: {type: 'string', short: 'h'},
  PORT: {type: 'number', short: 'p', required: true},
  DEBUG: {type: 'boolean'},
  HELP: {type: 'boolean'},
})

const {
  HOST = 'localhost',
  PORT,
  DEBUG,
  HELP,
} = cfg.parse()

if (HELP) {
  cfg.help()
  process.exit(0)
}

server.listen(PORT, HOST)
```

## Detailed usage

Specify options using format `FOO_BAR` (upper snake case).
Each option can have type, required flag and short name.
Supported types are: **string**, **number**, **boolean**,
**list** (array of strings) and **map** (object of strings).

First, options will be read from config files starting from `configDir` and going upwards.
First file with basename `configFile` will be parsed.
It must include an extension (either `.json` or [`.toml`](https://github.com/toml-lang/toml)).
Parser expects options to be formatted as `foo_bar` (lower snake case).

Then, options can be overwritten by environment variables.
Upper snake case format with optional `envPrefix` is expected.
Lists and maps are reset, not appended.
Format for lists is comma or semicolon separated string.
For maps it's a list of key-value pairs separated by `=`.

Lastly, options can be overwritten by command line arguments.
The format is `--foo-bar` (lower kebab case) or `-x` for short options.
Short options can be grouped (`-abc`).
Boolean options should be either `--opt` for true and `--no-opt` for false.
To provide a list, specify the same option multiple times.
For map specify a list of key-value pairs separated by `=`.
Special `_` option is automatically added, which contains a list of the rest of command line arguments.

## TODOs

- [x] Load config from env vars
- [x] Load config from command line args
- [x] Load config from JSON files
- [x] Generate help message
- [ ] 1.0
