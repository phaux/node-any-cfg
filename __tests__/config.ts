import { config } from "../src"

describe("loading from config files", () => {
  it("finds config file", () => {
    expect(
      config({
        configDir: `${__dirname}/config`,
        configFile: "foo",
      })
        .options({
          TEST_OPT: { type: "string" },
        })
        .parse({
          env: {},
          args: [],
        })
    ).toEqual({
      TEST_OPT: "foo",
      _: [],
    })
  })

  it("finds config file in parent folder", () => {
    expect(
      config({
        configDir: `${__dirname}/config`,
        configFile: "bar",
      })
        .options({
          TEST_OPT: { type: "number" },
        })
        .parse({
          env: {},
          args: [],
        })
    ).toEqual({
      TEST_OPT: 42,
      _: [],
    })
  })

  it("returns empty object when file not found", () => {
    expect(
      config({
        configDir: `${__dirname}/config`,
        configFile: "baaaaaaaaaaaaaz",
      })
        .options({
          TEST_OPT: { type: "number" },
        })
        .parse({
          env: {},
          args: [],
        })
    ).toEqual({
      _: [],
    })
  })

  it("loads list option", () => {
    expect(
      config()
        .options({
          FOO: { type: "list" },
        })
        .parse({
          env: {},
          args: [],
          config: {
            foo: ["foo", 42, true],
          },
        })
    ).toEqual({
      _: [],
      FOO: ["foo", "42", "true"],
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
          args: [],
          config: {
            foo: { foo: "bar", 42: 24 },
          },
        })
    ).toEqual({
      _: [],
      FOO: { foo: "bar", 42: "24" },
    })
  })

  it("throws on required but empty map", () => {
    expect(() => {
      config()
        .options({
          FOO: { type: "map", required: true },
        })
        .parse({
          env: {},
          args: [],
          config: {
            foo: {},
          },
        })
    }).toThrow()
  })

  it("throws on on required but empty list", () => {
    expect(() => {
      config()
        .options({
          FOO: { type: "list", required: true },
        })
        .parse({
          env: {},
          args: [],
          config: {
            foo: [],
          },
        })
    }).toThrow()
  })

  it("parses array as map", () => {
    expect(
      config()
        .options({
          FOO: { type: "map" },
        })
        .parse({
          env: {},
          args: [],
          config: {
            foo: ["foo"],
          },
        })
    ).toEqual({
      _: [],
      FOO: { 0: "foo" },
    })
  })

  it("throws on invalid boolean value", () => {
    expect(() => {
      config()
        .options({
          TEST: { type: "boolean" },
        })
        .parse({
          env: {},
          args: [],
          config: {
            test: "true",
          },
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
          args: [],
          config: {
            test: "42",
          },
        })
    }).toThrow()
  })
})
