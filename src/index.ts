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
    { from, to, source }: ConverterInput,
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
      to,
      source,
    })
    
    // const validationResult = await converted.validate()

    // if (!validationResult.valid) {
    //   throw validationResult.errors.message
    // }

    if (!isString(input)) {
      throw 'Please provide correct path for input file to be generated'
    }

    urlMethodMapping.forEach(item => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`Processing ${item.originalUrl}`);

      converted.spec.paths[item.originalUrl][item.method].operationId = item.methodName
    })

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write('\n');

    if (selectedOnly) {
      converted.spec.paths = Object.fromEntries(
        Object.entries(converted.spec.paths)
        .map(item => {
          const foundConfig = urlMethodMapping.find(config => config.originalUrl === item[0])

          if (foundConfig && foundConfig.proxyUrl) {
            return [foundConfig.proxyUrl, item[1]]
          }

          if (foundConfig) {
            return item
          }

          return [null, item[1]]
        })
        .filter(item => item[0] !== null)
      )
    }

    if (proxyConfig) {
      converted.spec.paths = Object.fromEntries(
        Object.entries(converted.spec.paths)
        .map(item => {
          if (item[0].includes(proxyConfig.replace)) {
            item[0] = item[0].replace(proxyConfig.replace, proxyConfig.with)
          }

          return item
        })
      )
    }

    converted = converted.stringify()

    modelNameMapping && modelNameMapping.forEach(item => {
      converted = converted.replace(new RegExp(item.fromRegExp, 'g'), item.newModelName)
    })

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
  source: string
  from: 'swagger_1' | 'swagger_2' | 'openapi_3' | 'api_blueprint' | 'io_docs' | 'google' | 'raml' | 'wadl'
  output: string
  proxyConfig?: {
    replace: string,
    with: string
  },
  modelNameMapping?: {
    fromRegExp: RegExp
    newModelName: string
  }[]
}

export type ServiceConfigDefault = BaseServiceConfig & {
  urlMethodMapping: undefined
  selectedOnly: undefined
}

export type ServiceConfigWithMappings = BaseServiceConfig & {
  urlMethodMapping: { 
    originalUrl: string
    method: 'get' | 'post' | 'put' | 'delete'
    methodName: string
    proxyUrl?: string
   }[]
  selectedOnly: boolean
}

export function defineConfig (config: {
  appendTemplate?: string
  services: (ServiceConfigDefault | ServiceConfigWithMappings)[]
}) {
  return config
}
