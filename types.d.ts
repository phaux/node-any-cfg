declare type Options = {
  vars: {
    [varName: string]: {
      type: 'string' | 'number' | 'boolean',
      required?: boolean,
      fallback?: string | number | boolean,
    },
  },
  _mockEnv?: {[varName: string]: string},
  envPrefix?: string,
}

declare type Results = {
  [varName: string]: string | number | boolean,
}
