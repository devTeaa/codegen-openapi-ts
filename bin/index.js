#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const params = program
    .name('codegen-openapi-ts')
    .usage('[options]')
    .version(pkg.version)
    .argument('<from>', 'Original response specification version')
    .argument('<source>', 'Swagger/OpenAPI response url')
    .argument('[output]', 'Output folder name', 'output')
    .parse(process.argv)
    .processedArgs;

const OpenAPI = require(path.resolve(__dirname, '../dist/index.js'));

if (OpenAPI) {
    OpenAPI.convertAndGenerate(
      {
        from: params[0],
        to: 'openapi_3',
        source: params[1]
      },
      {
        input: 'api-schema.json',
        output: params[2],
        useOptions: true,
        useUnionTypes: true
      },
    )
}
