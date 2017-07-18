// @flow

const FALSY_VALS: string[] = ['', '0', 'false']

type Options = {|
  vars: {
    [string]:
      | {|required?: false, type: 'string', value: string|}
      | {|required?: false, type: 'number', value: number|}
      | {|required?: false, type: 'boolean', value: boolean|}
      | {|required: true, type: 'string' | 'number' | 'boolean'|}
  },
  mockEnv?: {[string]: string},
  envPrefix?: string,
|}
export type Result = {
  [string]: string | number | boolean,
}

export default function loadConfig(opts: Options): Result {

  const env = opts.mockEnv || process.env
  const prefix = opts.envPrefix || ''

  return Object.keys(opts.vars)
    .map(k => [k, opts.vars[k]])
    .map(([name, opt]): [string, string | number | boolean] => {

      const key = prefix ? `${prefix}_${name}` : name
      const value = env[key]

      if (value === undefined || value === null) {

        if (opt.required) throw new Error(
          `The environment variable ${name} must be set!`
        )
        else return [key, opt.value]

      }

      if (opt.type == 'number') return [key, parseFloat(value)]
      else if (opt.type == 'boolean') return [key, !FALSY_VALS.includes(value)]
      else return [key, value]

    })
    .reduce((obj, [key, value]) => Object.assign(obj, {[key]: value}), {})
}
