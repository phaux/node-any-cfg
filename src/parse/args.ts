import { Mock, Opts, parseValue, Rest, Types, unreachable, Val, Vals } from "../common"

function parseArg(
  value: Val | undefined,
  type: keyof Types,
  next: string | undefined,
  short: boolean,
  bool = true
): {
  skip: boolean
  value: Val
} {
  if (type !== "boolean" && short) throw Error(`Can't appear in short option group`)
  switch (type) {
    case "map": {
      if (next == null) throw Error(`Missing value`)
      const [key, val] = next.split("=", 2)
      if (val == null) throw Error(`Missing value for "${key}" key`)
      return { skip: true, value: { ...(typeof value == "object" ? value : {}), [key]: val } }
    }
    case "list": {
      if (next == null) throw Error(`Missing value`)
      return { skip: true, value: [...(Array.isArray(value) ? value : []), next] }
    }
    case "boolean": {
      if (value != null) throw Error(`Multiple values`)
      return { skip: false, value: bool }
    }
    case "number":
    case "string": {
      if (next == null) throw Error(`Missing value`)
      if (value != null) throw Error(`Multiple values`)
      return { skip: true, value: parseValue(type, next) }
    }
    default: {
      return unreachable("type", type)
    }
  }
}

export function parseArgs<O extends Opts>(opts: O, mock?: Mock["args"]): Vals<O> & Rest {
  const args = mock ?? process.argv.slice(2)
  const results: { [option: string]: Val } = {}
  let i = 0
  const rest: string[] = []
  while (i < args.length) {
    const arg = args[i]

    // forced rest arguments
    if (arg === "--") {
      rest.push(...args.slice(i + 1))
      break
    }
    // long options
    else if (arg.substr(0, 2) === "--") {
      const argName = arg.substr(2)
      let invert = Boolean(argName.match(/^no-/iu))
      let optName = argName
        .replace(/^no-/iu, "")
        .replace(/-/u, "_")
        .toUpperCase()
      let opt = opts[optName]
      if (invert && (opt == null || opt.type !== "boolean")) {
        invert = false
        optName = `NO_${optName}`
        opt = opts[optName]
      }
      if (opt == null) throw Error(`Unknown argument: --${argName}`)
      try {
        const { value, skip } = parseArg(results[optName], opt.type, args[i + 1], false, !invert)
        results[optName] = value
        if (skip) i += 1
      } catch (err) {
        err.message = `Argument --${argName} error: ${(err as Error).message}`
        throw err
      }
    }
    // short options
    else if (arg.match(/^-./u) !== null) {
      for (let j = 1; j < arg.length; j += 1) {
        const argName = arg[j]
        const [optName, opt] = Object.entries(opts).find(([, opt]) => opt.short === argName) ?? [
          "",
          null,
        ]
        if (opt == null) throw Error(`Unknown argument: -${argName}`)
        const last = j === arg.length - 1
        try {
          const { value, skip } = parseArg(results[optName], opt.type, args[i + 1], !last)
          results[optName] = value
          if (skip) i += 1
        } catch (err) {
          err.message = `Argument -${argName} error: ${(err as Error).message}`
          throw err
        }
      }
    }
    // rest arguments
    else {
      rest.push(arg)
    }

    i += 1
  }

  return { ...results, _: rest } as any
}
