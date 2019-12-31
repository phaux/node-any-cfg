import { config } from "../src"

describe("loading from command line arguments", () => {
  it("loads options", () => {
    expect(
      config()
        .options({
          STR_OPT: { type: "string" },
          NUM_OPT: { type: "number" },
          BOOL_OPT: { type: "boolean" },
        })
        .parse({
          env: {},
          args: ["--num-opt", "42", "--str-opt", "foo"],
        })
    ).toEqual({
      _: [],
      NUM_OPT: 42,
      STR_OPT: "foo",
    })
  })

  it("loads rest options", () => {
    expect(
      config()
        .options({
          TEST: { type: "number" },
        })
        .parse({
          env: {},
          args: ["foo", "--test", "123", "bar", "--", "--baz"],
        })
    ).toEqual({
      _: ["foo", "bar", "--baz"],
      TEST: 123,
    })
  })

  it("loads list option", () => {
    expect(
      config()
        .options({
          FOO: { type: "list" },
        })
        .parse({
          args: ["--foo", "bar", "--foo", "42"],
        })
    ).toEqual({
      _: [],
      FOO: ["bar", "42"],
    })
  })

  it("loads map option", () => {
    expect(
      config()
        .options({
          FOO: { type: "map" },
        })
        .parse({
          env: {},
          args: ["--foo", "foo=bar", "--foo", "42=24"],
        })
    ).toEqual({
      _: [],
      FOO: { foo: "bar", 42: "24" },
    })
  })

  it("allows empty keys and values in map", () => {
    expect(
      config()
        .options({
          FOO: { type: "map" },
        })
        .parse({
          env: {},
          args: ["--foo", "="],
        })
    ).toEqual({
      _: [],
      FOO: { "": "" },
    })
  })

  it("throws on map key with no value", () => {
    expect(() => {
      config()
        .options({
          FOO: { type: "map" },
        })
        .parse({
          env: {},
          args: ["--foo", "bar"],
        })
    }).toThrow()
  })

  it("loads boolean options", () => {
    expect(
      config()
        .options({
          OPT_A: { type: "boolean" },
          OPT_B: { type: "boolean" },
          OPT_C: { type: "boolean" },
        })
        .parse({
          env: {},
          args: ["--opt-a", "--no-opt-b"],
        })
    ).toEqual({
      _: [],
      OPT_A: true,
      OPT_B: false,
    })
  })

  it("long negated boolean arg takes precedence", () => {
    expect(
      config()
        .options({
          FOO: { type: "boolean" },
          NO_FOO: { type: "string" },
        })
        .parse({
          env: {},
          args: ["--no-foo"],
        })
    ).toEqual({
      _: [],
      FOO: false,
    })
  })

  it("loads short options", () => {
    expect(
      config()
        .options({
          BOOL_OPT: { type: "boolean", short: "b" },
          NUM_OPT: { type: "number", short: "n" },
        })
        .parse({
          env: {},
          args: ["-bn", "123"],
        })
    ).toEqual({
      _: [],
      BOOL_OPT: true,
      NUM_OPT: 123,
    })
  })

  it("throws on valueless short option", () => {
    expect(() => {
      config()
        .options({
          BOOL_OPT: { type: "boolean", short: "b" },
          NUM_OPT: { type: "number", short: "n" },
        })
        .parse({
          env: {},
          args: ["-nb", "123"],
        })
    }).toThrow()
  })

  it("throws on unknown arg", () => {
    expect(() => {
      config()
        .options({
          TEST: { type: "number" },
        })
        .parse({
          env: {},
          args: ["--nope", "1"],
        })
    }).toThrow()
  })

  it("throws on missing arg value", () => {
    expect(() => {
      config()
        .options({
          TEST: { type: "number" },
        })
        .parse({
          env: {},
          args: ["--test"],
        })
    }).toThrow()
  })

  it("throws on invalid numeric value", () => {
    expect(() => {
      config()
        .options({
          TEST: { type: "number" },
        })
        .parse({
          env: {},
          args: ["--test", "123a"],
        })
    }).toThrow()
  })
})
