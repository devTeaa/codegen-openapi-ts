export type OpenApiJson = {
  openapi: string
  info: {
    title: string
    version: string
  }
  servers: {
    url: string
    description: string
  }[]
  paths: Paths
  components: Components
}

export type $ref = {
  '$ref': string
}

// #region Paths
type Paths = {
  [key: string]: {
    'get'?: Operation
    'post'?: Operation
    'put'?: Operation
    'delete'?: Operation
  }
}

type Operation = {
  tags: string[]
  operationId: string
  parameters?: {
    name: string
    in: 'query' | 'path'
    required: boolean
    schema: {
      type: 'string' | 'boolean'
    } | {
      type: 'array'
      items: {
        type: 'string'
      }
    } | $ref
  }[]
  requestBody?: {
    content: {
      'application/json': {
        schema: $ref
      }
    }
  }
  response: {
    200: {
      description: 'OK'
      content: {
        'application/json': {
          schema: $ref
        }
      }
    }
  }
}
// #endregion

// #region Components
type Components = {
  schemas: ComponentSchema
}

type ComponentSchema = {
  [key: string]: {
    type: 'object'
    properties: {
      [property: string]: {
        type: 'string'
        format?: 'date-time'
      } | {
        type: 'boolean'
      } | {
        type: 'integer'
        format: 'int32' | 'int64'
        maximum: number
      } | {
        type: 'array'
        items: $ref
      } | {
        type: 'object'
        additionalProperties: {
          type: 'array'
          items: {
            type: 'string'
          }
        }
      } | {
        type: 'object'
        properties: {
          [objProp: string]: {
            type: 'string'
          }
        }
      } | {
        type: string
      } | $ref
    }
  }
}
// #endregion
