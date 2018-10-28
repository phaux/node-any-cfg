import * as fs from 'fs'
import * as p from 'path'
// tslint:disable-next-line: no-var-requires no-require-imports
const TOML = require('toml')
import { Cfg, Mock, Opts, Types, unreachable, Val, Vals } from '../common'

type JSONValue = null | string | number | boolean | unknown[] | {[key: string]: unknown}

function readConfigFile(path: string, cfgFile?: string, mock?: any)
  : {config: {[option: string]: JSONValue}, file: string}
{
  if (mock != null) return {config: mock, file: '<mock_config>'}
  if (cfgFile == null) return {config: {}, file: '<no_config>'}
  let files: string[] = []
  try { files = fs.readdirSync(path) }
  catch (err) { return {config: {}, file: '<readdir_error>'} }
  for (const basename of files) {
    const file = `${path}/${basename}`
    const {name, ext} = p.parse(basename)
    if (name != cfgFile) continue
    const parse = (() => {
      switch (ext) {
        case '.json': return (s: string) => JSON.parse(s)
        case '.toml': return (s: string) => TOML.parse(s)
        default: throw Error(`${file}: Invalid config file extension "${ext}"`)
      }
    })()
    const config = parse(fs.readFileSync(file, 'utf8'))
    if (typeof config != 'object') throw Error(`${file}: Config is not a JSON object`)
    return {config, file}
  }
  const nextPath = p.resolve(path, '..')
  if (nextPath != path) return readConfigFile(nextPath, cfgFile)
  return {config: {}, file: '<no_config>'}
}

function parseConfigValue(type: keyof Types, value?: JSONValue): Val | undefined {
  switch (type) {
    case 'map': {
      if (value == null || typeof value != 'object') throw Error(`Value is not an object`)
      if (Object.keys(value).length == 0) return undefined
      const map: {[key: string]: string} = {}
      for (const [key, val] of Object.entries(value)) {
        map[key] = `${val}`
      }
      return map
    }
    case 'list': {
      if (!Array.isArray(value)) throw Error(`Value is not an array`)
      if (value.length == 0) return undefined
      return value.map(v => `${v}`)
    }
    case 'boolean': {
      if (typeof value != 'boolean') throw Error(`Value is not a boolean`)
      return value
    }
    case 'number': {
      if (typeof value != 'number') throw Error(`Value is not a number`)
      return value
    }
    case 'string': {
      if (typeof value != 'string') throw Error(`Value is not a string`)
      return value
    }
    default: return unreachable('type', type)
  }
}

export function parseConfig<O extends Opts>(cfg: Cfg, opts: O, mock?: Mock['config']): Vals<O> {

  const configDir = p.resolve(cfg.configDir != null ? cfg.configDir : '.')
  const {config, file} = readConfigFile(configDir, cfg.configFile, mock)
  const results: {[option: string]: Val} = {}

  for (const [optName, opt] of Object.entries(opts)) {
    const configKey = optName.toLowerCase()
    if (config[configKey] == null) continue
    try {
      const value = parseConfigValue(opt.type, config[configKey])
      if (value != null) results[optName] = value
      else delete results[optName]
    }
    catch (err) {
      err.message = `${file}: Option ${configKey} error: ${err.message}`
      throw err
    }
  }

  return results as any

}
