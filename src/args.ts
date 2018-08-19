import { Config, Options, parseValue, Rest, Result, Results, TypeMap, unreachable } from "./common"

function parseArg(
  value: Result | undefined,
  type: keyof TypeMap,
  next: string | undefined,
  short: boolean,
  bool: boolean = true,
): {
  skip: boolean,
  value: Result,
} {
  if (type != 'boolean' && short) throw Error(`Can't appear in short option group`)
  switch (type) {
    case 'map': {
      if (next == null) throw Error(`Missing value`)
      const [key, val] = next.split('=', 2)
      if (val == null) throw Error(`Missing value for "${key}" key`)
      return {skip: true, value: {...typeof value == 'object' ? value : {}, [key]: val}}
    }
    case 'list': {
      if (next == null) throw Error(`Missing value`)
      return {skip: true, value: [...Array.isArray(value) ? value : [], next]}
    }
    case 'boolean': {
      if (value != null) throw Error(`Multiple values`)
      return {skip: false, value: bool}
    }
    case 'number':
    case 'string': {
      if (next == null) throw Error(`Missing value`)
      if (value != null) throw Error(`Multiple values`)
      return {skip: true, value: parseValue(type, next)}
    }
    default: return unreachable('type', type)
  }
}

export function parseArguments<O extends Options>(cfg: Config<O>): Results<O> & Rest {

  const args = (cfg as any)._mockArgs || process.argv.slice(2)
  const results: {[option: string]: Result} = {}
  let i = 0
  const rest: string[] = []
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
          .find(([, opt]) => opt.short == argName) || ['', null]
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

  return {...results, _: rest} as any

}
