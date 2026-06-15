# codegen-openapi-ts (alpha)

[![NPM][npm-image]][npm-url]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Build](https://github.com/devteaa/codegen-openapi-ts/actions/workflows/CI.yml/badge.svg)

> Node.js library that generates TypeScript clients from OpenAPI/Swagger specifications.

This project is a fork of [OpenAPI Typescript Codegen](https://github.com/ferdikoomen/openapi-typescript-codegen) by [Ferdi Koomen](https://github.com/ferdikoomen). It adds conversion helpers, a config-file driven CLI, URL/method mapping, model-name mapping, proxy support, and custom append templates.

> ⚠️ **This branch is an alpha release (`v0.9.0-alpha.6`).** The API, config shape, and generated output may still change before `1.0.0`.

## Why?

- Frontend ❤️ OpenAPI, but we do not want to use Java codegen in our builds
- Quick, lightweight, robust and framework-agnostic 🚀
- Supports TypeScript client generation
- Supports conversion from Swagger 1.x/2.x and other formats to OpenAPI via [`api-spec-converter`](https://github.com/LucyBot-Inc/api-spec-converter)
- Supports JSON and YAML input files and URLs
- Supports Fetch, Node-Fetch, Axios, and XHR HTTP clients
- Supports config-file driven generation with `defineConfig`
- Supports selecting only specific paths/methods and proxying them
- Supports external references via [`@apidevtools/json-schema-ref-parser`](https://github.com/APIDevTools/json-schema-ref-parser)

## Install

```bash
npm install codegen-openapi-ts --save-dev
```

## CLI usage

`codegen-openapi-ts` is driven by a config file.

```bash
$ codegen-openapi-ts --help
Usage: codegen-openapi-ts [options]

Options:
  -V, --version     output the version number
  --config <value>  Path to config file (default: "codegen.config.js")
  -h, --help        display help for command
```

Create a `codegen.config.js` in your project root:

```javascript
const { defineConfig } = require('codegen-openapi-ts');

module.exports = defineConfig({
  // Optional: path to a Handlebars file appended to every generated service
  appendTemplate: './custom-append.hbs',

  services: [
    {
      source: 'https://example.com/openapi.json',
      from: 'openapi_3', // or 'swagger_1', 'swagger_2', 'api_blueprint', 'io_docs', 'google', 'raml', 'wadl'
      output: 'src/api-types/example-api',

      // Optional: global path proxy
      proxyConfig: (path) => path.replace('/api/', '/backend/'),

      // Optional: rename models in the stringified spec before generation
      modelNameMapping: (json) => json.replace(/some\.long\.name/g, 'ShortName'),

      // Optional: pick and rename specific paths/methods
      urlMethodMapping: [
        { originalUrl: '/pokemon-list', method: 'get', methodName: 'GetPokemonList' },
        { originalUrl: '/pokemon-detail/{id}', method: 'get', methodName: 'GetPokemonDetail', proxyUrl: '/proxy/pokemon-detail/{id}' }
      ],

      // Optional: only generate paths listed in urlMethodMapping
      selectedOnly: true
    }
  ]
});
```

Add a script to `package.json`:

```json
{
  "scripts": {
    "codegen": "codegen-openapi-ts"
  }
}
```

Then run:

```bash
npm run codegen
```

## Programmatic API

```javascript
const { generate, convertAndGenerate } = require('codegen-openapi-ts');

// Generate directly from an OpenAPI spec
await generate({
  input: './spec.json',
  output: './generated',
  httpClient: 'fetch', // 'fetch' | 'xhr' | 'node' | 'axios'
  clientName: 'MyClient',
  useUnionTypes: true,
  exportCore: true,
  exportServices: true,
  exportModels: true,
  exportSchemas: false,
  indent: '4', // '4' | '2' | 'tab'
  postfixServices: 'Service',
  postfixModels: ''
});

// Convert from another spec format and generate with mappings
await convertAndGenerate(
  { from: 'swagger_2', source: 'https://example.com/swagger.json' },
  { input: './api-schema.json', output: './generated', useUnionTypes: true },
  [
    { originalUrl: '/users', method: 'get', methodName: 'GetUsers' }
  ],
  true,                         // selectedOnly
  (json) => json.replace(/OldName/g, 'NewName'), // modelNameMapping
  '',                           // appendTemplate
  (path) => path.replace('/v1/', '/v2/') // proxyConfig
);
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `input` | `string \| object` | — | OpenAPI spec path, URL, or parsed object |
| `output` | `string` | — | Output directory |
| `httpClient` | `HttpClient` | `'fetch'` | `'fetch'`, `'xhr'`, `'node'`, `'axios'` |
| `clientName` | `string` | — | Custom client class name |
| `useOptions` | `boolean` | `false` | Use options argument for service methods |
| `useUnionTypes` | `boolean` | `false` | Use union types instead of enums |
| `exportCore` | `boolean` | `true` | Write `core/` files |
| `exportServices` | `boolean` | `true` | Write `services/` files |
| `exportModels` | `boolean` | `true` | Write `models/` files |
| `exportSchemas` | `boolean` | `false` | Write `schemas/` files |
| `indent` | `Indent \| '4' \| '2' \| 'tab'` | `'4'` | Indentation style |
| `postfixServices` | `string` | `'Service'` | Postfix for service names |
| `postfixModels` | `string` | `''` | Postfix for model names |
| `request` | `string` | — | Path to a custom request file |
| `write` | `boolean` | `true` | Write files to disk |
| `selectedOnly` | `boolean` | `false` | Only generate selected paths (V3) |
| `appendTemplate` | `string` | — | Path to a Handlebars template appended to services |

## Output folder

The current CLI and `generate()` entry point create:

```text
output/
├── models/          # API schema models
├── services/        # API service classes
└── index.ts         # barrel exports
```

The lower-level writer API can also produce `core/` (runtime request helpers, `OpenAPI` config, `CancelablePromise`, etc.) and `schemas/` folders, but these are not generated by the default entry points in this alpha release.

## Alpha caveats

- `convertAndGenerate()` writes a temporary `api-schema.json` to your project root and also stores a copy inside `node_modules/@apidevtools/json-schema-ref-parser/dist/` for `$ref` resolution.
- The CLI hardcodes `useOptions: true` and `useUnionTypes: true` for config-file generation.
- `useOptions`, `exportCore`, and `exportSchemas` are accepted by the programmatic API but currently forced to `false` internally. Use the lower-level writer API if you need direct control over these flags.

[npm-url]: https://npmjs.org/package/codegen-openapi-ts
[npm-image]: https://img.shields.io/npm/v/codegen-openapi-ts.svg
[build-url]: https://github.com/devteaa/codegen-openapi-ts/actions/workflows/CI.yml
[build-image]: https://github.com/devteaa/codegen-openapi-ts/actions/workflows/CI.yml/badge.svg
