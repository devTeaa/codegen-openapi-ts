const OpenAPI = require('./dist/index.js')

OpenAPI.convertAndGenerate(
  {
    from: 'swagger_2', // swagger_2
    to: 'openapi_3',
    source: process.argv[2] // https://pokemon-api/docs/api
  },
  {
    input: 'api-schema.json',
    output: 'output', // pokemon-api
    useOptions: true,
    useUnionTypes: true
  },
  [
    ['/backend/officialstore/broadcast-chats/{id}/chats', 'get', 'GetChatsList'],
  ],
)
