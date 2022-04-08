#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');
const OpenAPI = require(path.resolve(__dirname, '../dist/index.js'));

const appRoot = process.cwd().split('/node_modules')[0]

const params = program
    .name('codegen-openapi-ts')
    .usage('[options]')
    .version(pkg.version)
    .option('--config <value>', 'Path to config file', 'codegen.config.js')
    .parse(process.argv)
    .opts();

async function generateOnConfig () {
  try {
    const configFile = require(path.join(appRoot, params.config))

    for (let i = 0; i < configFile.length; i++) {
      console.log('Generating ' + configFile[i].source)
      await OpenAPI.convertAndGenerate(
        {
          from: configFile[i].from,
          to: 'openapi_3',
          source: configFile[i].source
        },
        {
          input: 'api-schema.json',
          output: configFile[i].output || 'output',
          useOptions: true,
          useUnionTypes: true
        },
        configFile[i].urlMethodMapping || [],
        configFile[i].selectedOnly || false
      )
    }
  } catch (err) {
    console.log(err)
  }
}

generateOnConfig()
