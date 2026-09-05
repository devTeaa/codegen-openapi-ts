import { defineConfig } from 'vitest/config';

const handlebarsMockPlugin = () => ({
    name: 'handlebars-mock',
    enforce: 'pre' as const,
    resolveId(id: string) {
        if (id.endsWith('.hbs')) {
            return id;
        }
        return null;
    },
    load(id: string) {
        if (id.endsWith('.hbs')) {
            return `export default { compiler: [8, '>= 4.3.0'], useData: true, main: () => '' };`;
        }
        return null;
    },
});

export default defineConfig({
    plugins: [handlebarsMockPlugin()],
    test: {
        environment: 'node',
        globals: true,
        include: ['src/**/*.spec.ts', 'test/index.spec.ts', 'bin/index.spec.js'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.d.ts', 'src/**/__mocks__/**'],
        },
    },
});
