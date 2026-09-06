#!/usr/bin/env node

import { program } from 'commander';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import { convertAndGenerate } from '../dist/index.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const appRoot = process.cwd().split('/node_modules')[0];

const DEFAULT_CONFIG_CANDIDATES = ['codegen.config.js', 'codegen.config.mjs', 'codegen.config.cjs'];

const params = program
    .name('codegen-openapi-ts')
    .usage('[options]')
    .version(pkg.version)
    .option('--config <value>', 'Path to config file')
    .parse(process.argv)
    .opts();

function resolveConfigPath() {
    if (params.config) {
        return path.resolve(appRoot, params.config);
    }
    const found = DEFAULT_CONFIG_CANDIDATES.find(candidate => fs.existsSync(path.resolve(appRoot, candidate)));
    if (!found) {
        throw new Error(`Config file not found. Create a codegen.config.js (or .mjs/.cjs) in ${appRoot}, or pass --config.`);
    }
    return path.resolve(appRoot, found);
}

async function loadConfig(configPath) {
    const configUrl = pathToFileURL(configPath).href;
    const module = await import(configUrl);
    return module.default ?? module;
}

async function generateOnConfig() {
    try {
        const configFile = await loadConfig(resolveConfigPath());

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
