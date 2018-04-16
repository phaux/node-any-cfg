/// <reference path="./types.d.ts" />

const TRUTHY_VALS = ['1', 'on', 'true']
const FALSY_VALS = ['', '0', 'off', 'false']

/**
 * @param {Options} opts
 * @return {Result}
 */
module.exports.loadConfig = opts => {

  const env = opts._mockEnv || process.env
  const prefix = opts.envPrefix || ''

  return Object.entries(opts.vars)
    // eslint-disable-next-line valid-jsdoc
    .map(/** @return {[string, string|number|boolean]} */ ([name, opt]) => {

      const key = (prefix ? `${prefix}_${name}` : name)
        .toUpperCase().replace(/\W/g, '_')
      const value = env[key]

      if (value === undefined || value === null) {

        if (opt.required) throw new Error(
          `The environment variable ${key} must be set!`
        )

        if (opt.value !== undefined) return [key, opt.value]
        else return [key, false]

      }

      if (opt.type == 'boolean') {
        if (TRUTHY_VALS.includes(value.toLowerCase())) return [key, true]
        if (FALSY_VALS.includes(value.toLowerCase()))  return [key, false]
        throw new Error(
          `The value of the environment variable ${key} must be one of: `
        + [...TRUTHY_VALS, ...FALSY_VALS]
          .map(s => JSON.stringify(s)).join(', ')
        )
      }
      else if (opt.type == 'number') return [key, parseFloat(value)]
      else return [key, value]

    })
    .reduce((obj, [key, value]) => Object.assign(obj, {[key]: value}), {})
}
