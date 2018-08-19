import { parseArguments } from "./args"
import { Config, Options, Rest, Result, Results } from "./common"
import { parseConfig } from "./config"
import { parseEnvironment } from "./env"

/** Parse options from config files, environment variables and command line arguments */
export function parse<O extends Options>(cfg: Config<O>): Results<O> & Rest {

  for (const optName of Object.keys(cfg.options)) {
    if (optName.match(/[^A-Z_]/)) throw Error(`Option name "${optName}" is invalid`)
  }

  const results: {[option: string]: Result} = {
    ...parseConfig(cfg) as {},
    ...parseEnvironment(cfg) as {},
    ...parseArguments(cfg) as {},
  }

  for (const [optName, opt] of Object.entries(cfg.options)) {
    if (results[optName] == null) {
      if (opt.required) throw Error(`Option ${optName} (${opt.type}) is required`)
      else if (opt.type == 'list') results[optName] = []
      else if (opt.type == 'map')  results[optName] = {}
    }
  }

  return results as any

}

export {Config, Option, Options, Results, Rest, TypeMap} from './common'
