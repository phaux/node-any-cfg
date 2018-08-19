import {Options, Config, Results, Rest} from '../src/index'
declare module "../lib/index" {
  export interface Mock {
    _mockArgs?: string[]
    _mockEnv?: {[option: string]: string}
  }
  export function parse<O extends Options>(cfg: Config<O> & Mock): Results<O> & Rest;
}
