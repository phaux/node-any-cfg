import { Config, Options, parseValue, Result, Results } from "./common"

export function parseEnvironment<O extends Options>(cfg: Config<O>): Results<O> {

  const args = (cfg as any)._mockEnv || process.env
  const results: {[option: string]: Result} = {}

  for (const [optName, opt] of Object.entries(cfg.options)) {
    const envName = `${cfg.envPrefix || ''}${optName}`
    const envValue = args[envName]
    if (envValue == null) continue
    results[optName] = parseValue(opt.type, envValue)
  }

  return results as any

}
