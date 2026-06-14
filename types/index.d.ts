export declare enum HttpClient {
    FETCH = 'fetch',
    XHR = 'xhr',
    NODE = 'node',
    AXIOS = 'axios',
}

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
    request?: string;
    write?: boolean;
    selectedOnly?: boolean;
};

export declare function generate(options: Options): Promise<void>;

export type BaseConfig = {
    source: string;
    from: 'swagger_1' | 'swagger_2' | 'openapi_3' | 'api_blueprint' | 'io_docs' | 'google' | 'raml' | 'wadl';
    output: string;
    modelNameMapping?: {
        fromRegExp: RegExp;
        newModelName: string;
    }[];
    urlMethodMapping?: {
        originalUrl: string;
        method: 'get' | 'post' | 'put' | 'delete';
        methodName: string;
        proxyUrl?: string;
    }[];
    selectedOnly?: boolean;
};

export declare function defineConfig(config: BaseConfig[]): BaseConfig[];

export declare function convertAndGenerate(
    converterInput: {
        from: BaseConfig['from'];
        to: 'openapi_3';
        source: string;
    },
    options: Options,
    urlMethodMapping?: NonNullable<BaseConfig['urlMethodMapping']>,
    selectedOnly?: boolean,
    modelNameMapping?: NonNullable<BaseConfig['modelNameMapping']>
): Promise<void>;
