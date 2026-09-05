declare module 'api-spec-converter' {
    export interface ConvertInput {
        from: string;
        to: string;
        source: string;
    }

    export interface ConvertedSpec {
        spec: Record<string, any>;
        stringify: () => string;
    }

    export function convert(input: ConvertInput): Promise<ConvertedSpec>;

    export default {
        convert,
    };
}
