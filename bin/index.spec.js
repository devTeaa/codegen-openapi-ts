import crossSpawn from 'cross-spawn';
import { describe, expect, it } from 'vitest';

const nodeEnv = {
    ...process.env,
    NODE_NO_WARNINGS: '1',
};

describe('bin', () => {
    it('it should support minimal params', async () => {
        const result = crossSpawn.sync(
            'node',
            ['./bin/cli.js', '--input', './test/spec/v3.json', '--output', './test/generated/bin'],
            { env: nodeEnv }
        );
        expect(result.stdout.toString()).toBe('');
        expect(result.stderr.toString()).toBe('');
    });

    it('it should support all params', async () => {
        const result = crossSpawn.sync(
            'node',
            [
                './bin/cli.js',
                '--input',
                './test/spec/v3.json',
                '--output',
                './test/generated/bin',
                '--client',
                'fetch',
                '--useOptions',
                '--useUnionTypes',
                '--exportCore',
                'true',
                '--exportServices',
                'true',
                '--exportModels',
                'true',
                '--exportSchemas',
                'true',
                '--indent',
                '4',
                '--postfixServices',
                'Service',
                '--postfixModels',
                'Dto',
            ],
            { env: nodeEnv }
        );
        expect(result.stdout.toString()).toBe('');
        expect(result.stderr.toString()).toBe('');
    });

    it('it should throw error without params', async () => {
        const result = crossSpawn.sync('node', ['./bin/cli.js'], { env: nodeEnv });
        expect(result.stdout.toString()).toBe('');
        expect(result.stderr.toString()).toContain(`error: required option '-i, --input <value>' not specified`);
    });

    it('it should throw error with wrong params', async () => {
        const result = crossSpawn.sync(
            'node',
            ['./bin/cli.js', '--input', './test/spec/v3.json', '--output', './test/generated/bin', '--unknown'],
            { env: nodeEnv }
        );
        expect(result.stdout.toString()).toBe('');
        expect(result.stderr.toString()).toContain(`error: unknown option '--unknown'`);
    });

    it('it should display help', async () => {
        const result = crossSpawn.sync('node', ['./bin/cli.js', '--help'], { env: nodeEnv });
        expect(result.stdout.toString()).toContain(`Usage: openapi [options]`);
        expect(result.stdout.toString()).toContain(`-i, --input <value>`);
        expect(result.stdout.toString()).toContain(`-o, --output <value>`);
        expect(result.stderr.toString()).toBe('');
    });
});
