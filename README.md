# OpenAPI Typescript Codegen

[![NPM][npm-image]][npm-url]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Node.js library that generates Typescript clients based on the OpenAPI specification.

> This project is a fork from [Openapi Typescript Codegen](https://github.com/ferdikoomen/openapi-typescript-codegen) by [Ferdi Koomen](https://github.com/ferdikoomen), the reason is because I need some changes and use some of the lower level generated code that I can use on my projects.

## Why?
- Frontend ❤️ OpenAPI, but we do not want to use JAVA codegen in our builds
- Quick, lightweight, robust and framework-agnostic 🚀
- Supports generation of TypeScript clients
- Supports OpenAPI specification v2.0 and v3.0
- Supports JSON and YAML files for input
- Supports generation through CLI, Node.js and NPX
- Supports tsc and @babel/plugin-transform-typescript
- Supports external references using [`json-schema-ref-parser`](https://github.com/APIDevTools/json-schema-ref-parser/)

## Install

```
npm install codegen-openapi-ts --save-dev
```


## Usage

```
$ openapi --help

  Usage: openapi [options]

  Options:
    -V, --version             output the version number
    -i, --input <value>       OpenAPI specification, can be a path, url or string content (required)
    -o, --output <value>      Output directory (required)
    --useUnionTypes           Use union types instead of enums
    --exportServices <value>  Write services to disk (default: true)
    --exportModels <value>    Write models to disk (default: true)
    --postfix <value>         Service name postfix (default: "Service")
    --request <value>         Path to custom request file
    -h, --help                display help for command

  Examples
    $ openapi --input ./spec.json
    $ openapi --input ./spec.json --output ./dist
    $ openapi --input ./spec.json --output ./dist --client xhr
```


## Example

**package.json**
```json
{
    "scripts": {
        "generate": "openapi --input ./spec.json --output ./dist"
    }
}
```

**NPX**

```
npx codegen-openapi-ts --input ./spec.json --output ./dist
```

**Node.js API**

```javascript
const OpenAPI = require('codegen-openapi-ts');

OpenAPI.generate({
    input: './spec.json',
    output: './dist'
});

// Or by providing the content of the spec directly 🚀
OpenAPI.generate({
    input: require('./spec.json'),
    output: './dist'
});
```


## Features

### Enums vs. Union Types `--useUnionTypes`
The OpenAPI spec allows you to define [enums](https://swagger.io/docs/specification/data-models/enums/) inside the
data model. By default, we convert these enums definitions to [TypeScript enums](https://www.typescriptlang.org/docs/handbook/enums.html).
However, these enums are merged inside the namespace of the model, this is unsupported by Babel, [see docs](https://babeljs.io/docs/en/babel-plugin-transform-typescript#impartial-namespace-support).
Because we also want to support projects that use Babel [@babel/plugin-transform-typescript](https://babeljs.io/docs/en/babel-plugin-transform-typescript),
we offer the flag `--useUnionTypes` to generate [union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types)
instead of the traditional enums. The difference can be seen below:

**Enums:**
```typescript
// Model
export interface Order {
    id?: number;
    quantity?: number;
    status?: Order.status;
}

export namespace Order {
    export enum status {
        PLACED = 'placed',
        APPROVED = 'approved',
        DELIVERED = 'delivered',
    }
}

// Usage
const order: Order = {
    id: 1,
    quantity: 40,
    status: Order.status.PLACED
}
```

**Union Types:**
```typescript
// Model
export interface Order {
    id?: number;
    quantity?: number;
    status?: 'placed' | 'approved' | 'delivered';
}

// Usage
const order: Order = {
    id: 1,
    quantity: 40,
    status: 'placed'
}
```

### Enum with custom names and descriptions
You can use `x-enum-varnames` and `x-enum-descriptions` in your spec to generate enum with custom names and descriptions.
It's not in official [spec](https://github.com/OAI/OpenAPI-Specification/issues/681) yet. But it's a supported extension
that can help developers use more meaningful enumerators.
```json
{
    "EnumWithStrings": {
        "description": "This is a simple enum with strings",
        "enum": [
            0,
            1,
            2
        ],
        "x-enum-varnames": [
            "Success",
            "Warning",
            "Error"
        ],
        "x-enum-descriptions": [
            "Used when the status of something is successful",
            "Used when the status of something has a warning",
            "Used when the status of something has an error"
        ]
    }
}
```

Generated code:
```typescript
enum EnumWithStrings {
    /*
    * Used when the status of something is successful
    */
    Success = 0,
    /*
    * Used when the status of something has a warning
    */
    Waring = 1,
    /*
    * Used when the status of something has an error
    */
    Error = 2,
}
```


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
