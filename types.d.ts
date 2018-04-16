declare type Options = {
  vars: {
    [varName: string]:
      | {required?: false, type: 'string', value: string}
      | {required?: false, type: 'number', value: number}
      | {required?: false, type: 'boolean', value?: boolean}
      | {required: true, type: 'string' | 'number' | 'boolean'}
  },
  _mockEnv?: {[varName: string]: string},
  envPrefix?: string,
}

declare type Result = {
  [varName: string]: string | number | boolean,
}
