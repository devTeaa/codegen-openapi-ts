#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const params = program
    .name('codegen-openapi-ts-cli')
    .usage('[options]')
    .version(pkg.version)
    .argument('<source>', 'Swagger/OpenAPI response url')
    .argument('<output>', 'Output folder name')
    .parse(process.argv)
    .processedArgs;

const OpenAPI = require(path.resolve(__dirname, '../dist/index.js'));

if (OpenAPI) {
    OpenAPI.generate({
      input: params[0],
      output: params[1],
      useOptions: true,
      useUnionTypes: true 
    })
}
