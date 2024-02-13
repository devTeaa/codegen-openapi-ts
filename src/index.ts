const Converter = require('api-spec-converter');
const shell = require('shelljs')
import { ConverterInput } from 'api-spec-converter';
import fs from 'fs'
import { HttpClient } from './HttpClient';
import { parse as parseV2 } from './openApi/v2';
import { parse as parseV3 } from './openApi/v3';
import { getOpenApiSpec } from './utils/getOpenApiSpec';
import { getOpenApiVersion, OpenApiVersion } from './utils/getOpenApiVersion';
import { isString } from './utils/isString';
import { postProcessClient } from './utils/postProcessClient';
import { registerHandlebarTemplates } from './utils/registerHandlebarTemplates';
import { writeClient } from './utils/writeClient';

export { HttpClient } from './HttpClient';

export type Options = {
    input: string | Record<string, any>;
    output: string;
    httpClient?: HttpClient;
    useOptions?: boolean;
    useUnionTypes?: boolean;
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportSchemas?: boolean;
    postfix?: string;
    request?: string;
    write?: boolean;
    selectedOnly?: boolean;
    appendTemplate?: ReturnType<typeof defineConfig>['appendTemplate']
};

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param input The relative location of the OpenAPI spec
 * @param output The relative location of the output directory
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore: Generate core client classes
 * @param exportServices: Generate services
 * @param exportModels: Generate models
 * @param exportSchemas: Generate schemas
 * @param postfix: Service name postfix
 * @param request: Path to custom request file
 * @param write Write the files to disk (true or false)
 */
export async function generate({
    input,
    output,
    httpClient = HttpClient.FETCH,
    useOptions = false,
    useUnionTypes = false,
    exportCore = true,
    exportServices = true,
    exportModels = true,
    exportSchemas = false,
    postfix = 'Service',
    request,
    write = true,
    selectedOnly = false,
    appendTemplate = ''
}: Options): Promise<void> {
    const openApi = isString(input) ? await getOpenApiSpec(input) : input;
    const openApiVersion = getOpenApiVersion(openApi);
    const templates = registerHandlebarTemplates({
        httpClient,
        useUnionTypes,
        useOptions: false,
    });

    switch (openApiVersion) {
        case OpenApiVersion.V2: {
            const client = parseV2(openApi);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient(
                clientFinal,
                templates,
                output,
                httpClient,
                false,
                useUnionTypes,
                false,
                exportServices,
                exportModels,
                false,
                postfix,
                request,
                appendTemplate
            );
            break;
        }

        case OpenApiVersion.V3: {
            const client = parseV3(openApi, selectedOnly);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient(
                clientFinal,
                templates,
                output,
                httpClient,
                false,
                useUnionTypes,
                false,
                exportServices,
                exportModels,
                false,
                postfix,
                request,
                appendTemplate
            );
            break;
        }
    }
}

/**
 * Generate the OpenAPI client with options to convert swagger to openapi etc.
 * @param converterInput.from The schema specification for the response (swagger_1, swagger_2, openapi_3)
 * @param converterInput.to The schema specification for the output (openapi_3)
 * @param converterInput.source The relative location of the OpenAPI spec
 * @param options.httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param options.useUnionTypes Use union types instead of enums
 * @param options.exportCore: Generate core client classes
 * @param options.exportServices: Generate services
 * @param options.exportModels: Generate models
 * @param options.exportSchemas: Generate schemas
 * @param options.postfix: Service name postfix
 * @param options.request: Path to custom request file
 * @param options.write Write the files to disk (true or false)
 */
export async function convertAndGenerate(
    { from, source }: ConverterInput,
    { input, output, useOptions, useUnionTypes }: Options,
    urlMethodMapping: ServiceConfigWithMappings['urlMethodMapping'] = [],
    selectedOnly: ServiceConfigWithMappings['selectedOnly'] = false,
    modelNameMapping?: BaseServiceConfig['modelNameMapping'],
    appendTemplate?: ReturnType<typeof defineConfig>['appendTemplate'],
    proxyConfig?: BaseServiceConfig['proxyConfig'],
  ): Promise<void> {
  try {
    const sshRegex = new RegExp('((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)(/)?')

    if (sshRegex.test(source)) {
      shell.exec(`git archive --remote=${source} | tar -xO > ./api-schema.json`)

      if (typeof(input) === 'string') {
        source = input
      }
    }

    let converted = await Converter.convert({
      from,
      to: from,
      source,
    })

    urlMethodMapping.forEach(item => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`Processing ${item.originalUrl} ${item.method} ${item.methodName}`);

      converted.spec.paths[item.originalUrl][item.method].operationId = item.methodName
    })

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write('\n');

    converted.spec.paths = Object.fromEntries(
      Object.entries(converted.spec.paths)
      .map(item => {
        const foundConfig = urlMethodMapping.find(config => config.originalUrl === item[0])

        if (foundConfig && foundConfig.proxyUrl) {
          return [foundConfig.proxyUrl, item[1]]
        }

        if (selectedOnly && !foundConfig) {
          return [null, item[1]]
        }

        if (proxyConfig) {
          return [proxyConfig(item[0]), item[1]]
        }

        return [item[0], item[1]]
      })
      .filter(item => item[0] !== null)
    )

    converted = converted.stringify()

    if (modelNameMapping) {
      converted = modelNameMapping(converted)
    }

    if (typeof input === 'string') {
      fs.writeFileSync(input, converted)
    }

    generate({
      input,
      output,
      useOptions,
      useUnionTypes,
      selectedOnly,
      appendTemplate
    })
  } catch (err) {
    process.stdout.write(`\n`);
    throw err
  }
}

export type BaseServiceConfig = {
  /**
   * API Docs request url for the json response
   */
  source: string
  /**
   * Specify the API specs response format version
   */
  from: 'swagger_1' | 'swagger_2' | 'openapi_3' | 'api_blueprint' | 'io_docs' | 'google' | 'raml' | 'wadl'
  /**
   * Specify the folder for the codegen output
   */
  output: string
  /**
   * Create a function for proxying the request
   * @example
   * {
   *  // ... other config
   *  proxyConfig: (path) => {
   *    return path.replace('/api/', '/be/')
   *  }
   * }
   * @param {string} path
   */
  proxyConfig?: (path: string) => string,
  /**
   * Can be used to replace long model names specified on the schema.
   * Please use the api-schema.json generated on root project folder
   * to debug the desired results. Also note that the original schema name
   * with dot (.) will be generated as underscore (_). Example:
   * some.long.name will be generated as some_long_name,
   * if this modelNameMapping supplied
   * @example
   * {
   *  // ... other config
   *  modelNameMapping: (json) => {
   *    // remember to use global flag to all regexp used here
   *    return config.replace(new RegExp('some.long.name', g), 'shortname')
   *  }
   * }
   * 
   * @param {string} json - stringified json schema
   */
  modelNameMapping?: (json: string) => string
}

export type ServiceConfigDefault = BaseServiceConfig & {
  urlMethodMapping: undefined
  selectedOnly: undefined
}

export declare type ServiceConfigWithMappings = BaseServiceConfig & {
  /**
   * Custom spec paths mapping. You can configure to rename the method name
   * or customise the proxyUrl for the specific API
   * 
   * @example
   * {
   *  // ... other config
   *  urlMethodMapping: [
   *    { originalUrl: '/pokemon-list', method: 'get', methodName: 'GetPokemonList' },
   *    { originalUrl: '/pokemon-detail/{id}', method: 'get', methodName: 'GetPokemonList', proxyUrl: '/proxy/pokemon-detail/{id}' }
   *  ]
   * }
   *
   */
  urlMethodMapping: {
      originalUrl: string;
      method: 'get' | 'post' | 'put' | 'delete';
      methodName: string;
      proxyUrl?: string;
  }[];
  /**
   * Flag to only generate listed specs based on urlMethodMapping.
   * The codegen will still generate all the models listed on the api specs
   */
  selectedOnly: boolean;
};

/**
 * Type helper to make it easier to use codegen.config.js
 */
export declare function defineConfig(config: {
  /**
   * Custom api templates append on top of service files
   */
  appendTemplate?: string;
  /**
   * List config for every services
   */
  services: (ServiceConfigDefault | ServiceConfigWithMappings)[];
}): {
  appendTemplate?: string | undefined;
  services: (ServiceConfigDefault | ServiceConfigWithMappings)[];
};