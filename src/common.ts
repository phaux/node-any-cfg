export interface Config<O extends Options> {
  /** This prefix is added to every environment variable option */
  envPrefix?: string
  /** Option definitions */
  options: O
}

export interface Options {[opt: string]: Option}

export interface Option {
  /** Option value type */
  type: keyof TypeMap
  /** Require option to be set or otherwise throw exception */
  required?: boolean
  /** One character version of the option name, used in the command line */
  short?: string
}

export interface TypeMap {
  'string': {req: string, opt: string | undefined}
  'number': {req: number, opt: number | undefined}
  'boolean': {req: boolean, opt: boolean | undefined}
  'list': {req: string[], opt: string[]}
  'map': {req: {[key: string]: string}, opt: {[key: string]: string}}
}

export type Result = TypeMap[keyof TypeMap]['req']

export interface Rest {_: string[]}

export type Results<O extends Options> = {
  [K in keyof O]: TypeMap[O[K]['type']][O[K]['required'] extends true ? 'req' : 'opt']
}

export const unreachable = (thing: string, value: never): never => {
  throw Error(`Invalid ${thing}: ${value}`)
}

const TRUTHY_VALS = ['1', 'on', 'true']
const FALSY_VALS = ['', '0', 'off', 'false']
export function parseValue(type: keyof TypeMap, str: string): Result {
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
