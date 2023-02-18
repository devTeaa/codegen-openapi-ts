import { $ref, OpenApiJson } from "../open-api-json";
import { HttpMethod } from "../user-config";

type SchemasKeyProp = [
  string,
  OpenApiJson['components']['schemas'][string]['properties']
][]

const getSchemasKeyProps = (schemas: OpenApiJson['components']['schemas']): SchemasKeyProp => {
  return Object.keys(schemas).map(key => [
    key,
    schemas[key].properties
  ])
}

// Resolve { $ref: string } to { type: schema-key-name }
const resolveRefs = (schemasKeyProp: SchemasKeyProp): SchemasKeyProp => {
  (JSON.parse(JSON.stringify(schemasKeyProp)) as SchemasKeyProp).forEach(item => {
    Object.keys(item[1]).map(value => {
      const refItem = item[1][value] as $ref
      console.log(item[1][value])
      if ('$ref' in item[1][value]) {
        const splittedStringRef = refItem['$ref'].split('/')
        item[1][value] = {
          type: splittedStringRef[splittedStringRef.length - 1]
        }
      }
    })
  })
  
  return schemasKeyProp
}

const getPathKeyProps = (paths: OpenApiJson['paths']) => {
  const data = Object.keys(paths).map(path => {
    let pathController = ''
    const operationPath = paths[path] as OpenApiJson['paths'][string]
    Object.keys(operationPath).map((operation) => {
      pathController = paths[path][operation as HttpMethod]?.tags[0] || ''
    })

    return [pathController, paths[path]]
  })

  console.log(paths)
  // console.log(data.sort((a, b) => a[0] > b[0] ? 1 : -1))
}

export {
  getSchemasKeyProps,
  getPathKeyProps,
  resolveRefs
}
