declare type Options = {
  vars: {
    [varName: string]: {
      type: 'string' | 'number' | 'boolean',
      required?: boolean,
    },
  },
  _mockEnv?: {[varName: string]: string},
  envPrefix?: string,
}

declare type Result = {
  [varName: string]: string | number | boolean,
}
