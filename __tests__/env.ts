import { config } from "../src"

describe("loading from evironment variables", () => {
  it("loads options", () => {
    expect(
      config()
        .options({
          STR: { type: "string" },
          NUM: { type: "number" },
          BOOL: { type: "boolean" },
        })
        .parse({
          env: {
            NUM: "42",
            BOOL: "off",
          },
          args: [],
        })
    ).toEqual({
      _: [],
      NUM: 42,
      BOOL: false,
    })
  })

  it("loads list option", () => {
    expect(
      config()
        .options({
          FOO: { type: "list" },
        })
        .parse({
          env: {
            FOO: "foo,bar,42",
          },
          args: [],
        })
    ).toEqual({
      _: [],
      FOO: ["foo", "bar", "42"],
    })
  })

  it("loads map option", () => {
    expect(
      config()
        .options({
          FOO: { type: "map" },
        })
        .parse({
          env: {
            FOO: "foo=bar,42=24",
          },
          args: [],
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
          env: {
            FOO: "a=b,=",
          },
          args: [],
        })
    ).toEqual({
      _: [],
      FOO: { a: "b", "": "" },
    })
  })

  it("throws on map key with no value", () => {
    expect(() => {
      config()
        .options({
          FOO: { type: "map" },
        })
        .parse({
          env: {
            FOO: "a=b,c",
          },
          args: [],
        })
    }).toThrow()
  })

  it("loads options with envPrefix", () => {
    expect(
      config({ envPrefix: "TEST_" })
        .options({
          STR: { type: "string" },
          NUM: { type: "number" },
          BOOL: { type: "boolean" },
        })
        .parse({
          env: {
            TEST_STR: "foobar",
            TEST_NUM: "0.5",
            TEST_BOOL: "true",
          },
          args: [],
        })
    ).toEqual({
      _: [],
      STR: "foobar",
      NUM: 0.5,
      BOOL: true,
    })
  })

  it("throws on invalid boolean value", () => {
    expect(() => {
      config()
        .options({
          TEST: { type: "boolean" },
        })
        .parse({
          env: {
            TEST: "truee",
          },
          args: [],
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
          env: {
            TEST: "1234a",
          },
          args: [],
        })
    }).toThrow()
  })
})
