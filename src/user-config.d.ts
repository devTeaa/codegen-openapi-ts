export type HttpMethod = 'get' | 'post' | 'put' | 'delete'

type CodegenConfig = {
  source: string
  from: 'swagger_1' | 'swagger_2' | 'openapi_3' | 'api_blueprint' | 'io_docs' | 'google' | 'raml' | 'wadl'
  output: string
  modelNameMapping?: [
    RegExp, string
  ][]
}

export type CodegenWithoutMappingConfig = CodegenConfig & {
  urlMethodMapping: undefined
  selectedOnly: undefined
}

export type CodegenWithMappingConfig = CodegenConfig & {
  urlMethodMapping: [
    string, HttpMethod, string, string?
  ][]
  selectedOnly: boolean
}
