declare module 'api-spec-converter' {
  export default {
    convert({
      from,
      source,
    }: ConverterInput): {
      validate: () => void
      stringify: () => any
    }
  }

  export type ConverterInput = {
    from: 'swagger_1' | 'swagger_2' | 'openapi_3'
    source: string
  } 
}
