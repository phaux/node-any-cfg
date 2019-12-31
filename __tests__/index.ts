import { config } from "../src"

describe("index", () => {
  it("throws on wrong option name format", () => {
    expect(() => {
      config()
        .options({
          testOpt: { type: "string" },
        })
        .parse({ env: {}, args: [] })
    }).toThrow()
  })

  it("throws on missing required option", () => {
    expect(() => {
      config()
        .options({
          TEST: { type: "list", required: true },
        })
        .parse({ env: {}, args: [] })
    }).toThrow()
  })

  xit("unset optional list should result in empty array", () => {
    expect(
      config()
        .options({
          TEST: { type: "list" },
        })
        .parse({ env: {}, args: [] })
    ).toEqual({
      _: [],
      TEST: [],
    })
  })

  xit("unset optional map should result in empty object", () => {
    expect(
      config()
        .options({
          TEST: { type: "map" },
        })
        .parse({ env: {}, args: [] })
    ).toEqual({
      _: [],
      TEST: {},
    })
  })

  it("arguments overwrite environment and config", () => {
    expect(
      config()
        .options({
          STR_OPT: { type: "string" },
          NUM_OPT: { type: "number", short: "n" },
          LIST_OPT: { type: "list" },
        })
        .parse({
          env: { STR_OPT: "a", NUM_OPT: "1", LIST_OPT: "x" },
          args: ["--num-opt", "2"],
          config: { list_opt: ["0"] },
        })
    ).toEqual({
      _: [],
      STR_OPT: "a",
      NUM_OPT: 2,
      LIST_OPT: ["x"],
    })
  })
})
