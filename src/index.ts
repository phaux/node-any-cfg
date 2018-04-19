const TRUTHY_VALS = ['1', 'on', 'true']
const FALSY_VALS = ['', '0', 'off', 'false']

export type Options = {
  vars: {
    [varName: string]: {
      type: 'string' | 'number' | 'boolean',
      required?: boolean,
      fallback?: string | number | boolean,
    },
  },
  _mockEnv?: {[varName: string]: string},
  _mockArgs?: string[],
  envPrefix?: string,
}

export type Results = {
  [varName: string]: string | number | boolean,
}

export function loadConfig(opts: Options): Results {

  const results: Results = {}

  const env = opts._mockEnv || process.env

  for (const [optName, opt] of Object.entries(opts.vars)) {

    if (opt.fallback != null && typeof opt.fallback != opt.type) throw new Error(
      `The option ${optName} of type ${opt.type} uses wrong fallback value of type `
      + typeof opt.fallback,
    )

    const envName = `${opts.envPrefix || ''}${optName}`
      .toUpperCase().replace(/[^A-Z0-9_]/gi, '_')
    const value = env[envName]

    if (value == null) {
      if (opt.required) throw new Error(
        `The environment variable ${envName} must be set!`,
      )
      if (opt.fallback != null) results[optName] = opt.fallback
    }
    else if (opt.type == 'boolean') {
      if (TRUTHY_VALS.includes(value.toLowerCase())) results[optName] = true
      else if (FALSY_VALS.includes(value.toLowerCase())) results[optName] = false
      else throw new Error(
        `The value of the environment variable ${envName} must be one of: `
        + [...TRUTHY_VALS, ...FALSY_VALS]
          .map(s => JSON.stringify(s)).join(', '),
      )
    }
    else if (opt.type == 'number') {
      const num = parseFloat(value)
      if (value.match(/[^-0-9.]/) || Number.isNaN(num))
        throw new Error(`The environment variable ${envName} is not a valid number`)
      results[optName] = num
    }
    else if (opt.type == 'string') results[optName] = value
    else throw new Error('Invalid var type')

  }

  return results

}
