# codegen-openapi-ts

[![NPM][npm-image]][npm-url]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Build](https://github.com/devteaa/codegen-openapi-ts/actions/workflows/CI.yml/badge.svg)

> Node.js library that generates TypeScript clients from OpenAPI/Swagger specifications.

This project is a fork of [OpenAPI Typescript Codegen](https://github.com/ferdikoomen/openapi-typescript-codegen) by [Ferdi Koomen](https://github.com/ferdikoomen). It adds conversion helpers, a config-file driven CLI, URL/method mapping, model-name mapping, proxy support, and custom append templates.

## Why?

- Frontend ❤️ OpenAPI, but we do not want to use Java codegen in our builds
- Quick, lightweight, robust and framework-agnostic 🚀
- Supports TypeScript client generation
- Supports OpenAPI 3.0 and 3.1 specs natively (no converter in the path)
- Converts Swagger 2.0 to OpenAPI 3 via [`swagger2openapi`](https://github.com/mermade/swagger2openapi)
- Supports JSON and YAML input files and URLs
- Supports Fetch, Node-Fetch, Axios, and XHR HTTP clients
- Supports config-file driven generation with `defineConfig`
- Supports selecting only specific paths/methods and proxying them
- Supports external references via [`@apidevtools/json-schema-ref-parser`](https://github.com/APIDevTools/json-schema-ref-parser)

## Install

```bash
npm install codegen-openapi-ts --save-dev
```

Requires Node.js >= 24 (ESM only).

## CLI usage

`codegen-openapi-ts` is driven by a config file.

```bash
$ codegen-openapi-ts --help
Usage: codegen-openapi-ts [options]

Options:
  -V, --version     output the version number
  --config <value>  Path to config file
  -h, --help        display help for command
```

If `--config` is omitted, the CLI looks for a config file in the project root in this order:

1. `codegen.config.js`
2. `codegen.config.mjs`
3. `codegen.config.cjs`

> **Note:** this library is ESM-only. If your project does not have `"type": "module"` in its `package.json`, name your config `codegen.config.mjs` — that extension is always loaded as ESM, regardless of your package type.

Create a `codegen.config.mjs` (or `.js` in an ESM project) in your project root:

```javascript
import { defineConfig } from 'codegen-openapi-ts';

export default defineConfig({
  // Optional: path to a Handlebars file appended to every generated service
  appendTemplate: './custom-append.hbs',

  services: [
    {
      source: 'https://example.com/openapi.json',
      from: 'openapi_3', // or 'swagger_2'
      output: 'src/api-types/example-api',

      // Optional: global path proxy
      proxyConfig: (path) => path.replace('/api/', '/backend/'),

      // Optional: rename models in the stringified spec before generation
      modelNameMapping: (json) => json.replace(/some\.long\.name/g, 'ShortName'),

      // Optional: pick and rename specific paths/methods (object form only)
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

Paths listed in `urlMethodMapping` that do not exist in the spec are skipped with a warning instead of failing the run.

## Spec format support

| `from` | Handling |
|---|---|
| `openapi_3` | Loaded and `$ref`-bundled with `@apidevtools/json-schema-ref-parser` — works for both **3.0.x and 3.1.x**, no converter in the path |
| `swagger_2` | Converted to OpenAPI 3 by [`swagger2openapi`](https://github.com/mermade/swagger2openapi) v7 (`patch: true, warnOnly: true`) |

All `urlMethodMapping`, `proxyConfig`, and `modelNameMapping` transforms apply in both paths.

> **Breaking:** formats previously delegated to `api-spec-converter` (`swagger_1`, `raml`, `wadl`, `api_blueprint`, `io_docs`, `google`) are no longer supported — that package is unmaintained (frozen since 2021) and its dependency tree carried multiple HIGH/CRITICAL CVEs (jsonpath, static-eval, underscore, validator, form-data, cross-spawn). Convert those formats to OpenAPI 3 yourself before generating if you need them.

## Programmatic API

```javascript
import { generate, convertAndGenerate } from 'codegen-openapi-ts';

// Generate directly from an OpenAPI spec (2.0, 3.0, or 3.1)
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
  true,                                           // selectedOnly
  (json) => json.replace(/OldName/g, 'NewName'),  // modelNameMapping
  '',                                             // appendTemplate
  (path) => path.replace('/v1/', '/v2/')          // proxyConfig
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

The config-file CLI (`codegen-openapi-ts`) creates:

```text
output/
├── models/          # API schema models
├── services/        # API service classes
└── index.ts         # barrel exports
```

> **Note:** the config CLI does not generate the `core/` runtime folder. Generated services still `import { request } from '../core/request.js'` and `CancelablePromise` from `../core/CancelablePromise.js'` — provide these from your own request layer, or use the programmatic `generate()` with `exportCore: true` (default) to emit them.

`generate()` (programmatic API and the `openapi` CLI) creates `core/` by default:

```text
output/
├── core/            # runtime: request layer, OpenAPI config, CancelablePromise
├── models/          # API schema models
├── services/        # API service classes
└── index.ts         # barrel exports
```

## Known caveats

- `urlMethodMapping` accepts the object form only. The tuple form (`['/path', 'get', 'Method']`) from the old alpha releases (`0.x`) is no longer supported.
- `convertAndGenerate()` writes a temporary `api-schema.json` to your project root.
- The CLI hardcodes `useOptions: true` and `useUnionTypes: true` for config-file generation, and does not generate the `core/` runtime folder.
- `useOptions`, `exportCore`, and `exportSchemas` are accepted by the programmatic API but currently forced to `false` internally. Use the lower-level writer API if you need direct control over these flags.

[npm-url]: https://npmjs.com/package/codegen-openapi-ts
[npm-image]: https://img.shields.io/npm/v/codegen-openapi-ts.svg
[build-url]: https://github.com/devteaa/codegen-openapi-ts/actions/workflows/CI.yml
[build-image]: https://github.com/devteaa/codegen-openapi-ts/actions/workflows/CI.yml/badge.svg
