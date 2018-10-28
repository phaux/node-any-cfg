import { parseArgs } from "./parse/args"
import { parseConfig } from "./parse/config"
import { parseEnv } from "./parse/env"

/** Global parser parameters */
export interface Cfg {
  /** Options which are supposed to be parsed from environment variables will have this prefix */
  envPrefix?: string
  /** directory from which to start search for config file. default: `.` */
  configDir?: string
  /** File name of the config file without extension. Default: don't look for the config */
  configFile?: string
  /** Description of the program displayed in the help message */
  help?: string
}

/** Option definitions */
export interface Opts {[opt: string]: Opt}

/** Single option definition */
export interface Opt {
  /** Option value type */
  type: keyof Types
  /** Require option to be set or otherwise throw exception */
  required?: boolean
  /** One character version of the option name, used in the command line */
  short?: string
  /** Description of the option shown in help message */
  help?: string
}

/** For testing purposes only */
export interface Mock {
  env?: {[opt: string]: string}
  args?: string[]
  config?: object
}

/** Type name mappings to actual TypeScript types */
export interface Types {
  string: string
  number: number
  boolean: boolean
  list: Array<string>
  map: Record<string, string>
}

export type Val = Types[keyof Types]

/** Extra value representing positional command line arguments provided by user */
export interface Rest {_: string[]}

/** Parsed values */
export type Vals<O extends Opts> = {
  [K in keyof O]:
    O[K]['required'] extends true
    ? Types[O[K]['type']]
    : Types[O[K]['type']] | undefined
}

export const unreachable = (thing: string, value: never): never => {
  throw Error(`Invalid ${thing}: ${value}`)
}

const TRUTHY_VALS = ['1', 'on', 'true']
const FALSY_VALS = ['', '0', 'off', 'false']
export function parseValue(type: keyof Types, str: string): Val {
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
        if (val == null) throw Error(`Missing value for '${key}' key`)
        map[key] = val
      }
      return map
    }
    default: return unreachable('type', type)
  }
}

/**
 * Parse options from config files, environment variables and command line arguments
 * @param cfg The options object
 * @return Parsed options as key-value map + rest arguments from command line as special `_` option
 */
export function parseAll<O extends Opts>(cfg: Cfg, opts: O, mock: Mock = {}): Vals<O> & Rest {

  for (const optName of Object.keys(opts)) {
    if (optName.match(/[^A-Z_]/)) throw Error(`Option name '${optName}' is invalid`)
  }

  const results: {[option: string]: Val} = {
    ...parseConfig(cfg, opts, mock.config) as {},
    ...parseEnv(cfg, opts, mock.env) as {},
    ...parseArgs(opts, mock.args) as {},
  }

  for (const [optName, opt] of Object.entries(opts)) {
    if (results[optName] == null) {
      if (opt.required) throw Error(`Option ${optName} (${opt.type}) is required`)
    }
  }

  return results as any

}

/** Help message format */
export type Format = 'markdown' | 'text'

export function printHelp<O extends Opts>(cfg: Cfg, opts: O, format: Format = 'text'): void {

  if (cfg.help) console.log(cfg.help.replace(/^[ \t]*/gm, ''))

  if (format == 'markdown') console.log(`\n**Options:**\n`)
  else console.log(`\nOptions:\n`)

  for (const [opt, {type, short, required, help}] of Object.entries(opts)) {

    const config = opt.toLowerCase()
    const arg = config.replace('_', '-')

    console.log([
      format == 'markdown' ? '*   ' : '',
      format == 'markdown' ? '`' : '',
      type == 'boolean'
        ? (short ? `--(no-)${arg}/-${short}` : `--(no-)${arg}`)
        : (short ? `--${arg}/-${short}` : `--${arg}`),
      type == 'map' ? ` key=string`
        : type == 'list' ? ' string'
          : type != 'boolean' ? ` ${type}` : '',
      type == 'list' || type == 'map' ? ' ...' : '',
      format == 'markdown' ? '`' : '',
      `, `,
      format == 'markdown' ? '`' : '',
      `${cfg.envPrefix || ''}${opt}=`,
      type == 'map' ? 'key=string,...'
        : type == 'list' ? 'string,...'
          : `${type}`,
      format == 'markdown' ? '`' : '',
      required && (format == 'markdown' ? ` **(required)**` : ` (required)`),
      format == 'markdown' ? ' - ' : '',
    ].join(''))

    if (help) console.log(help.replace(/^\s*/gm, '    '), '\n')

  }

  if (cfg.configFile) {
    console.log(`Options can be provided via \`${cfg.configFile}.json\` or \`${cfg.configFile}.toml\` config file.`)
    console.log(`Key names should be in lower_snake_case.`)
  }

}
