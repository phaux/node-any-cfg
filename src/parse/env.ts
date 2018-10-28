import { Cfg, Mock, Opts, parseValue, Val, Vals } from "../common"

export function parseEnv<O extends Opts>(cfg: Cfg, opts: O, mock?: Mock['env']): Vals<O> {

  const args = mock || process.env
  const results: {[option: string]: Val} = {}

  for (const [optName, opt] of Object.entries(opts)) {
    const envName = `${cfg.envPrefix || ''}${optName}`
    const envValue = args[envName]
    if (envValue == null) continue
    results[optName] = parseValue(opt.type, envValue)
  }

  return results as any

}
