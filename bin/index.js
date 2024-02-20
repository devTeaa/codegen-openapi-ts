#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const esmConfig = require('esm-config');
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
    const configFile = await esmConfig(path.join(appRoot, params.config))

    for (const configService of configFile.services) {
      console.log('Generating ' + configService.source)

      await OpenAPI.convertAndGenerate(
        {
          from: configService.from,
          source: configService.source
        },
        {
          input: 'api-schema.json',
          output: configService.output || 'output',
          useOptions: true,
          useUnionTypes: true,
        },
        configService.urlMethodMapping || [],
        configService.selectedOnly || false,
        configService.modelNameMapping,
        configFile.appendTemplate,
        configService.proxyConfig
      )
    }
  } catch (err) {
    console.log(err)
  }
}

generateOnConfig()
