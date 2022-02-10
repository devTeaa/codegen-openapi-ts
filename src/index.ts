const Converter = require('api-spec-converter');
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
                request
            );
            break;
        }

        case OpenApiVersion.V3: {
            const client = parseV3(openApi);
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
                request
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
export async function convertAndGenerate({ from, to, source }: ConverterInput, { input, output, useOptions, useUnionTypes }: Options, replaceOperations: [string, 'get' | 'post' | 'put' | 'delete', string][]): Promise<void> {
  try {
    const converted = await Converter.convert({
      from,
      to,
      source,
    })
    converted.validate()

    if (!isString(input)) {
      console.error('Please provide correct path for input file to be generated')
      return
    }

    replaceOperations.forEach(value => {
      converted.spec.paths[value[0]][value[1]].operationId = value[2]
    })

    if (typeof input === 'string') {
      fs.writeFileSync(input, converted.stringify())
    }

    generate({
      input,
      output,
      useOptions,
      useUnionTypes,
    })
  } catch (err) {
    console.error(err)
  }
}
