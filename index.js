/// <reference path="./types.d.ts" />

const TRUTHY_VALS = ['1', 'on', 'true']
const FALSY_VALS = ['', '0', 'off', 'false']

/**
 * @param {Options} opts
 * @return {Result}
 */
module.exports.loadConfig = opts => {

  /** @type {Result} */
  const results = {}

  const env = opts._mockEnv || process.env

  for (const [optName, opt] of Object.entries(opts.vars)) {
    const envName = `${opts.envPrefix || ''}${optName}`
      .toUpperCase().replace(/[^A-Z0-9_]/gi, '_')
    const value = env[envName]

    if (value == null) {
      if (opt.required) throw new Error(
        `The environment variable ${envName} must be set!`
      )
    }
    else if (opt.type == 'boolean') {
      if (TRUTHY_VALS.includes(value.toLowerCase())) results[optName] = true
      else if (FALSY_VALS.includes(value.toLowerCase())) results[optName] = false
      else throw new Error(
        `The value of the environment variable ${envName} must be one of: `
        + [...TRUTHY_VALS, ...FALSY_VALS]
          .map(s => JSON.stringify(s)).join(', ')
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
