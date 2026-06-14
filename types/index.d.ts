export declare enum HttpClient {
    FETCH = 'fetch',
    XHR = 'xhr',
    NODE = 'node',
    AXIOS = 'axios',
    ANGULAR = 'angular',
}

export declare enum Indent {
    SPACE_4 = '4',
    SPACE_2 = '2',
    TAB = 'tab',
}

export type Options = {
    input: string | Record<string, any>;
    output: string;
    httpClient?: HttpClient | 'fetch' | 'xhr' | 'node' | 'axios' | 'angular';
    clientName?: string;
    useOptions?: boolean;
    useUnionTypes?: boolean;
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportSchemas?: boolean;
    indent?: Indent | '4' | '2' | 'tab';
    postfixServices?: string;
    postfixModels?: string;
    request?: string;
    write?: boolean;
    selectedOnly?: boolean;
    appendTemplate?: string;
};

export declare function generate(options: Options): Promise<void>;

export type BaseServiceConfig = {
    source: string;
    from: 'swagger_1' | 'swagger_2' | 'openapi_3' | 'api_blueprint' | 'io_docs' | 'google' | 'raml' | 'wadl';
    output: string;
    proxyConfig?: (path: string) => string;
    modelNameMapping?: (json: string) => string;
};

export type ServiceConfigDefault = BaseServiceConfig & {
    urlMethodMapping: undefined;
    selectedOnly: undefined;
};

export type ServiceConfigWithMappings = BaseServiceConfig & {
    urlMethodMapping: {
        originalUrl: string;
        method: 'get' | 'post' | 'put' | 'delete';
        methodName: string;
        proxyUrl?: string;
    }[];
    selectedOnly: boolean;
};

export type Config = {
    appendTemplate?: string;
    services: (ServiceConfigDefault | ServiceConfigWithMappings)[];
};

export declare function defineConfig(config: Config): Config;

export declare function convertAndGenerate(
    converterInput: {
        from: BaseServiceConfig['from'];
        source: string;
    },
    options: Options,
    urlMethodMapping?: ServiceConfigWithMappings['urlMethodMapping'],
    selectedOnly?: boolean,
    modelNameMapping?: BaseServiceConfig['modelNameMapping'],
    appendTemplate?: string,
    proxyConfig?: BaseServiceConfig['proxyConfig']
): Promise<void>;

declare type OpenAPI = {
    HttpClient: typeof HttpClient;
    generate: typeof generate;
};

export default OpenAPI;
