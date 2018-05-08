const TRUTHY_VALS = ['1', 'on', 'true']
const FALSY_VALS = ['', '0', 'off', 'false']

export type Config = {
  envPrefix?: string,
  options: {[option: string]: Option},
  _mockEnv?: {[option: string]: string},
  _mockArgs?: string[],
}

export type Option = {
  type: 'string' | 'number' | 'boolean',
  short?: string,
}

export type Results = {
  [option: string]: string | number | boolean,
}

function parseValue(type: string, str: string): any {
  switch (type) {
    case 'string': return str
    case 'number': {
      const num = parseFloat(str)
      if (str.match(/[^-0-9.]/) || Number.isNaN(num))
        throw Error(`Not a valid number: ${str}`)
      return num
    }
    case 'boolean': {
      if (TRUTHY_VALS.includes(str.toLowerCase())) return true
      else if (FALSY_VALS.includes(str.toLowerCase())) return false
      else throw Error(`Not a valid boolean: ${str}`)
    }
    default: throw Error(`Invalid type: ${type}`)
  }
}

export function loadFromEnv(cfg: Config): {results: Results} {

  const args = cfg._mockEnv || process.env
  const results: Results = {}

  for (const [optName, opt] of Object.entries(cfg.options)) {
    const envName = `${cfg.envPrefix || ''}${optName}`
    const envValue = args[envName]
    if (envValue == null) continue
    results[optName] = parseValue(opt.type, envValue)
  }

  return {results}

}

export function loadFromArgs(cfg: Config): {results: Results, rest: string[]} {

  const args = cfg._mockArgs || process.argv.slice(2)
  const results: Results = {}

  let i = 0
  const rest = []
  while (i < args.length) {

    if (args[i] == '--') {
      rest.push(...args.slice(i + 1))
      break
    }

    else if (args[i].substr(0, 2) == '--') {

      const argName = args[i].substr(2)
      const invert = !!argName.match(/^no-/i)
      const optName = argName.replace(/^no-/i, '').replace(/-/, '_').toUpperCase()
      const opt = cfg.options[optName]

      if (optName in results) throw Error(`Multiple values for ${argName}`)
      else if (!opt) throw Error(`Unknown argument "${argName}"`)
      else if (opt.type == 'boolean') {
        results[optName] = !invert
        i += 1
      }
      else {
        if (invert) throw Error(`Argument "${argName}" is not a boolean`)
        if (args[i + 1] == null)  throw Error(`Argument "${argName}" is missing a value`)
        results[optName] = parseValue(opt.type, args[i + 1])
        i += 2
      }

    }
    else if (args[i].match(/^-./)) {
      for (let j = 1; j < args[i].length; j += 1) {

        const argName = args[i][j]
        const [optName, opt] = Object.entries(cfg.options)
          .find(([optName, opt]) => opt.short == argName) || ['', null]

        if (!opt) throw Error(`Unknown argument: "${argName}"`)
        else if (opt.type == 'boolean') {
          results[optName] = true
        }
        else if (j == args[i].length - 1 && args[i + 1] != null) {
          results[optName] = parseValue(opt.type, args[i + 1])
          i += 1
          break
        }
        else throw Error(`Argument "${argName}" is missing a value`)

      }
      i += 1
    }

    else {
      rest.push(args[i])
      i += 1
    }

  }

  return {results, rest}

}

export function load(cfg: Config): {results: Results, rest: string[]} {

  for (const optName of Object.keys(cfg.options)) {
    if (optName.match(/[^A-Z_]/)) throw Error(`Option name "${optName}" is invalid`)
  }

  const {results: envResults} = loadFromEnv(cfg)
  const {results: argsResults, rest} = loadFromArgs(cfg)
  const results: Results = {...envResults, ...argsResults}

  return {results, rest}

}
