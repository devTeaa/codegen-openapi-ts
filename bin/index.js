#!/usr/bin/env node

import { program } from 'commander';
import { createRequire } from 'module';
import path from 'path';
import { pathToFileURL } from 'url';

import { convertAndGenerate } from '../dist/index.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const appRoot = process.cwd().split('/node_modules')[0];

const params = program
    .name('codegen-openapi-ts')
    .usage('[options]')
    .version(pkg.version)
    .option('--config <value>', 'Path to config file', 'codegen.config.js')
    .parse(process.argv)
    .opts();

async function loadConfig(configPath) {
    const absolutePath = path.resolve(appRoot, configPath);
    const configUrl = pathToFileURL(absolutePath).href;
    const module = await import(configUrl);
    return module.default ?? module;
}

async function generateOnConfig() {
    try {
        const configFile = await loadConfig(params.config);

        for (const configService of configFile.services) {
            console.log('Generating ' + configService.source);

            await convertAndGenerate(
                {
                    from: configService.from,
                    source: configService.source,
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
            );
        }
    } catch (err) {
        console.log(err);
    }
}

generateOnConfig();
