declare module 'swagger2openapi' {
    interface ConvertOptions {
        patch?: boolean;
        warnOnly?: boolean;
        targetVersion?: string;
        [key: string]: any;
    }

    interface ConvertResult {
        openapi: Record<string, any>;
        original?: Record<string, any>;
        [key: string]: any;
    }

    type Callback = (err: Error | null, options: ConvertResult) => void;

    const converter: {
        convertObj(obj: any, options: ConvertOptions, callback: Callback): void;
        convertUrl(url: string, options: ConvertOptions, callback: Callback): void;
        convertFile(file: string, options: ConvertOptions, callback: Callback): void;
        convertStr(str: string, options: ConvertOptions, callback: Callback): void;
    };

    export default converter;
}
