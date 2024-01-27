# OpenAPI Typescript Codegen

[![NPM][npm-image]][npm-url]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Build](https://github.com/devTeaa/codegen-openapi-ts/actions/workflows/CI.yml/badge.svg)

> Node.js library that generates Typescript clients based on the OpenAPI specification.

> This project is a fork from [Openapi Typescript Codegen](https://github.com/ferdikoomen/openapi-typescript-codegen) by [Ferdi Koomen](https://github.com/ferdikoomen), the reason is because I need some changes and use some of the lower level generated code that I can use on my projects.

## Why?
- Frontend ❤️ OpenAPI, but we do not want to use JAVA codegen in our builds
- Quick, lightweight, robust and framework-agnostic 🚀
- Supports generation of TypeScript clients
- Supports conversion from Swagger 1.x/2.x to OpenAPI 2.x/3.x with [`api-spec-converter`](https://github.com/LucyBot-Inc/api-spec-converter)
- Supports JSON and YAML files for input
- Supports generation through Node.js
- Supports tsc and @babel/plugin-transform-typescript
- Supports external references using [`json-schema-ref-parser`](https://github.com/APIDevTools/json-schema-ref-parser/)
- Supports generate multiple api based on config file 
- Supports only generate specified api based on the url and http method (v0.4.1)
- Supports custom map model naming (v0.4.2)
- Supports fetching single file and generate type from that (v0.4.3)
- Supports custom url request mapping (ex: backend gateway) (v0.5.3)
- Supports config autocomplete wrapper (v0.5.8)
- Supports generating relevant models if selectedOnly (v0.5.8)
- Supports esm config (v0.6.0)
- Support defineConfig (v0.7.0)
- New config model (v0.7.1)

## Install

```
npm install codegen-openapi-ts --save-dev
```


## Usage

```
codegen-openapi-ts --help
Usage: codegen-openapi-ts [options]

Options:
  -V, --version     output the version number
  --config <value>  Path to config file (default: "codegen.config.js")
  -h, --help        display help for command
```

**codegen.config.js**
```
export default defineConfig([
  {
    source: OpenAPI Swagger response (can check on the network response on the spec page),
    from: swagger_1, swagger_2, openapi_3, api_blueprint, io_docs, google, raml, wadl,
    output: output folder
    urlMethodMapping: { 
      originalUrl: api path,
      method: http method (get/post/put/delete),
      methodName: output operation name,
      proxyUrl?: custom url api path
    }[]
    selectedOnly: this will make it so only generate services under urlMethodMapping, the default is false,
    modelNameMapping: {
      fromRegExp: regex model name on schema,
      newModelName: output model name
    }[]
  },
]);
```

## Example
**codegen.config.js**
```javascript
module.exports = [
  {
    source: 'http://pokemon-api/docs/api',
    from: 'openapi_3',
    output: 'src/api-types/pokemon-api', // pokemon-api
    urlMethodMapping: [
      {
        originalUrl: 'get-pokemon-list/gen1',
        method: 'get',
        methodName: 'GetPokemonListGen1'
      },
      {
        originalUrl: 'get-pokemon-list/gen2',
        method: 'get',
        methodName: 'GetPokemonListGen2',
        proxyUrl: 'gateway/get-pokemon-list/gen2'
      }
    ],
    selectedOnly: true,
    modelNameMapping: [
      {
        fromRegExp: /some\.custom\.model\.naming/,
        newModelName: 'CustomModelNaming'
      }
    ],
  },
  {
    // source: '<git repo> <branch name> <file to path>',
    source: 'ssh://git@github.com/pokemon/pokemon-api.git master -- docs/evolution-path.json',
    from: 'openapi_3',
    output: 'src/api-types/evolution-path', // evolution-path
  }, 
];
```

**package.json**
```json
{
  "scripts": {
    "codegen": "codegen-openapi-ts"
  }
}

// npm run generate
```
### Output folder
    .
    ├── ...
    ├── src                         # output value ('src/api-types/')
    │   ├── api-types               
    │   |   ├── pokemon-api         # output
    │   |   |   ├── models          # API schema models
    │   |   |   ├── services        # API service level with methods/url/response/request types
    │   |   |   └── index.ts        
    |   |   └── ...
    └── ...


## Features
### Nullable in OpenAPI v2
In the OpenAPI v3 spec you can create properties that can be NULL, by providing a `nullable: true` in your schema.
However, the v2 spec does not allow you to do this. You can use the unofficial `x-nullable` in your specification
to generate nullable properties in OpenApi v2.

```json
{
    "ModelWithNullableString": {
        "required": ["requiredProp"],
        "description": "This is a model with one string property",
        "type": "object",
        "properties": {
            "prop": {
                "description": "This is a simple string property",
                "type": "string",
                "x-nullable": true
            },
            "requiredProp": {
                "description": "This is a simple string property",
                "type": "string",
                "x-nullable": true
            }
        }
    }
}
```

Generated code:
```typescript
interface ModelWithNullableString {
    prop?: string | null,
    requiredProp: string | null,
}
```

### References

Local references to schema definitions (those beginning with `#/definitions/schemas/`)
will be converted to type references to the equivalent, generated top-level type.

The OpenAPI generator also supports external references, which allows you to break
down your openapi.yml into multiple sub-files, or incorporate third-party schemas
as part of your types to ensure everything is able to be TypeScript generated.

External references may be:
* *relative references* - references to other files at the same location e.g.
  `{ $ref: 'schemas/customer.yml' }`
* *remote references* - fully qualified references to another remote location
   e.g. `{ $ref: 'https://myexampledomain.com/schemas/customer_schema.yml' }`

   For remote references, both files (when the file is on the current filesystem)
   and http(s) URLs are supported.

External references may also contain internal paths in the external schema (e.g.
`schemas/collection.yml#/definitions/schemas/Customer`) and back-references to
the base openapi file or between files (so that you can reference another
schema in the main file as a type of an object or array property, for example).

At start-up, an OpenAPI or Swagger file with external references will be "bundled",
so that all external references and back-references will be resolved (but local
references preserved).


FAQ
===

### Babel support
If you use enums inside your models / definitions then those enums are by default inside a namespace with the same name
as your model. This is called declaration merging. However, the [@babel/plugin-transform-typescript](https://babeljs.io/docs/en/babel-plugin-transform-typescript)
does not support these namespaces, so if you are using babel in your project please use the `--useUnionTypes` flag
to generate union types instead of traditional enums. More info can be found here: [Enums vs. Union Types](#enums-vs-union-types---useuniontypes).

**Note:** If you are using Babel 7 and Typescript 3.8 (or higher) then you should enable the `onlyRemoveTypeImports` to
ignore any 'type only' imports, see https://babeljs.io/docs/en/babel-preset-typescript#onlyremovetypeimports for more info

```javascript
module.exports = {
    presets: [
        ['@babel/preset-typescript', {
            onlyRemoveTypeImports: true,
        }],
    ],
};
```

In order to compile the project and resolve the imports, you will need to enable the `allowSyntheticDefaultImports`
in your `tsconfig.json` file.


[npm-url]: https://npmjs.org/package/
[npm-image]: https://img.shields.io/npm/v/codegen-openapi-ts.svg
[coverage-url]: https://codecov.io/gh/ferdikoomen/codegen-openapi-ts
[coverage-image]: https://img.shields.io/codecov/c/github/ferdikoomen/codegen-openapi-ts.svg
[quality-url]: https://lgtm.com/projects/g/ferdikoomen/codegen-openapi-ts
[quality-image]: https://img.shields.io/lgtm/grade/javascript/g/ferdikoomen/codegen-openapi-ts.svg
[climate-url]: https://codeclimate.com/github/ferdikoomen/codegen-openapi-ts
[climate-image]: https://img.shields.io/codeclimate/maintainability/ferdikoomen/codegen-openapi-ts.svg
[downloads-url]: http://npm-stat.com/charts.html?package=codegen-openapi-ts
[downloads-image]: http://img.shields.io/npm/dm/codegen-openapi-ts.svg
[build-url]: https://circleci.com/gh/ferdikoomen/codegen-openapi-ts/tree/master
[build-image]: https://circleci.com/gh/ferdikoomen/codegen-openapi-ts/tree/master.svg?style=svg
