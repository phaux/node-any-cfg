import { Cfg, Format, Mock, Opts, parseAll, printHelp, Rest, Vals } from "./common"

class ParserOptions<O extends Opts> {
  /** @ignore */
  constructor(private readonly cfg: Cfg, private readonly opts: O) {}

  /**
   * Load options from config file, environment variables and command line arguments
   * @return Object of options with their values
   */
  parse(mock: Mock = {}): Vals<O> & Rest {
    return parseAll(this.cfg, this.opts, mock)
  }

  /** Prints help message to STDOUT. It's generated automatically based on the option definitions */
  help(format: Format = "text"): void {
    printHelp(this.cfg, this.opts, format)
  }
}

class ParserConfig {
  /** @ignore */
  constructor(private readonly cfg: Cfg = {}) {}

  /** Provide option definitions to the parser */
  options<O extends Opts>(opts: O): ParserOptions<O> {
    return new ParserOptions(this.cfg, opts)
  }
}

/** Initialize the config parser */
export const config = (cfg: Cfg = {}): ParserConfig => new ParserConfig(cfg)

export { Cfg, Opts }
