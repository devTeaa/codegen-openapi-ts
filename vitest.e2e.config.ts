import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: ['test/e2e/**/*.spec.ts'],
        exclude: ['node_modules', 'test/e2e/generated'],
        fileParallelism: false,
        coverage: {
            enabled: false,
        },
    },
});
