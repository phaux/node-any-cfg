const TRUTHY_VALS = ['1', 'on', 'true']
const FALSY_VALS = ['', '0', 'off', 'false']

export type Config<O extends Options> = {
  envPrefix?: string,
  options: O,
  _mockEnv?: {[option: string]: string},
  _mockArgs?: string[],
}

export type Options = {[opt: string]: Option}

export type Option = {
  type: keyof TypeMap,
  required?: boolean,
  short?: string,
}

export type TypeMap = {
  'string': {required: string, optional: string | undefined},
  'number': {required: number, optional: number | undefined},
  'boolean': {required: boolean, optional: boolean | undefined},
  'list': {required: string[], optional: string[]},
  'map': {required: {[key: string]: string}, optional: {[key: string]: string}},
}

export type OptRequired<O extends Option> =
  O['required'] extends true ? 'required' : 'optional'

export type ResultsMap<O extends Options> = {
  [K in keyof O]: TypeMap[O[K]['type']][OptRequired<O[K]>]
}

export type Results<O extends Options> = ResultsMap<O> & {_: string[]}

const unreachable = (thing: string, value: never): never => {
  throw Error(`Invalid ${thing}: ${value}`)
}

function parseValue(type: keyof TypeMap, str: string): any {
  switch (type) {
    case 'string': return str
    case 'number': {
      const num = parseFloat(str)
      if (str.match(/[^-0-9.]/) || Number.isNaN(num))
        throw Error(`Not a valid number`)
      return num
    }
    case 'boolean': {
      if (TRUTHY_VALS.includes(str.toLowerCase())) return true
      else if (FALSY_VALS.includes(str.toLowerCase())) return false
      else throw Error(`Not a valid boolean`)
    }
    case 'list': {
      return str.split(/[,;]\s*/)
    }
    case 'map': {
      const map: {[key: string]: string} = {}
      const pairs = str
        .split(/[,;]\s*/)
        .filter(pair => pair.match(/\S/))
        .map(pair => pair.split('=', 2))
      for (const [key, val] of pairs) {
        if (val == null) throw Error(`Missing value for "${key}" key`)
        map[key] = val
      }
      return map
    }
    default: return unreachable('type', type)
  }
}

export function loadFromEnv<O extends Options>(cfg: Config<O>): {results: {}} {

  const args = cfg._mockEnv || process.env
  const results: any = {}

  for (const [optName, opt] of Object.entries(cfg.options)) {
    const envName = `${cfg.envPrefix || ''}${optName}`
    const envValue = args[envName]
    if (envValue == null) continue
    results[optName] = parseValue(opt.type, envValue)
  }

  return {results}

}

function parseArg(
  value: any,
  type: keyof TypeMap,
  next: string,
  short: boolean,
  bool: boolean = true,
): {skip: boolean, value: any} {
  if (type != 'boolean' && short) throw Error(`Can't appear in short option group`)
  if (type != 'boolean' && next == null) throw Error(`Missing value`)
  switch (type) {
    case 'map': {
      const [key, val] = next.split('=', 2)
      if (val == null) throw Error(`Missing value for "${key}" key`)
      return {skip: true, value: {...value != null ? value : {}, [key]: val}}
    }
    case 'list': {
      return {skip: true, value: [...value != null ? value : [], next]}
    }
    case 'boolean': {
      if (value != null) throw Error(`Multiple values`)
      return {skip: false, value: bool}
    }
    case 'number':
    case 'string': {
      if (value != null) throw Error(`Multiple values`)
      return {skip: true, value: parseValue(type, next)}
    }
    default: return unreachable('type', type)
  }
}

export function loadFromArgs<O extends Options>(cfg: Config<O>): {results: {}, rest: string[]} {

  const args = cfg._mockArgs || process.argv.slice(2)
  const results: any = {}
  let i = 0
  const rest = []
  while (i < args.length) {

    const arg = args[i]

    if (arg == '--') {
      rest.push(...args.slice(i + 1))
      break
    }

    else if (arg.substr(0, 2) == '--') {
      const argName = arg.substr(2)
      let invert = !!argName.match(/^no-/i)
      let optName = argName.replace(/^no-/i, '').replace(/-/, '_').toUpperCase()
      let opt = cfg.options[optName]
      if (invert && (!opt || opt.type != 'boolean')) {
        invert = false
        optName = `NO_${optName}`
        opt = cfg.options[optName]
      }
      if (!opt) throw Error(`Unknown argument: --${argName}`)
      try {
        const {value, skip} = parseArg(results[optName], opt.type, args[i + 1], false, !invert)
        results[optName] = value
        if (skip) i += 1
      }
      catch (err) {
        err.message = `Argument --${argName} error: ${err.message}`
        throw err
      }
    }
    else if (arg.match(/^-./)) {
      for (let j = 1; j < arg.length; j += 1) {
        const argName = arg[j]
        const [optName, opt] = Object.entries(cfg.options)
          .find(([optName, opt]) => opt.short == argName) || ['', null]
        if (!opt) throw Error(`Unknown argument: -${argName}`)
        const last = j == arg.length - 1
        try {
          const {value, skip} = parseArg(results[optName], opt.type, args[i + 1], !last)
          results[optName] = value
          if (skip) i += 1
        }
        catch (err) {
          err.message = `Argument -${argName} error: ${err.message}`
          throw err
        }
      }
    }
    else rest.push(arg)
    i += 1
  }

  return {results, rest}

}

export function load<O extends Options>(cfg: Config<O>): Results<O> {

  for (const optName of Object.keys(cfg.options)) {
    if (optName.match(/[^A-Z_]/)) throw Error(`Option name "${optName}" is invalid`)
  }

  const {results: envResults} = loadFromEnv(cfg)
  const {results: argsResults, rest} = loadFromArgs(cfg)
  const results: any = {...envResults, ...argsResults, _: rest}

  for (const [optName, opt] of Object.entries(cfg.options)) {
    if (results[optName] == null) {
      if (opt.required) throw Error(`Option ${optName} (${opt.type}) is required`)
      else if (opt.type == 'list') results[optName] = []
      else if (opt.type == 'map')  results[optName] = {}
    }
  }

  return results

}
