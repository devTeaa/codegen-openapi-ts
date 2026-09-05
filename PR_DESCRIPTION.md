# PR Description

Use this text for <https://github.com/devTeaa/codegen-openapi-ts/pull/191>.

Suggested title:

```text
chore: migrate to ESM-only, Vitest, and Node.js 24
```

---

## Summary

This PR modernizes the project to be **ESM-only**, replaces **Jest with Vitest**, and raises the minimum supported Node.js version to **24**.

## Motivation

The project was shipping a mixed CommonJS/ESM build using Rollup + Jest. Moving to a pure ESM toolchain simplifies the build, aligns with the current Node.js ecosystem, and lets us drop legacy CJS compatibility workarounds.

## Major changes

### 1. ESM-only

- Added `"type": "module"` to `package.json`.
- Replaced `"main"`/`"types"` with a modern `"exports"` map:
  ```json
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
  ```
- Converted all runtime source and CLI entry points to ESM:
  - `src/index.ts`
  - `bin/index.js`
  - `bin/cli.js`
  - `test/index.js`
- Replaced `__dirname` / `require` in the CLI with `fileURLToPath` / `import` / `createRequire`.
- Updated `tsconfig.json` to `module: ESNext` + `moduleResolution: Bundler` and `target: ES2022`.
- Updated Rollup output format from `cjs` to `es`.

### 2. Replaced Jest with Vitest

- Removed `jest.config.ts`, `babel.config.json`, and Jest-related dependencies.
- Added `vitest.config.ts` for unit tests and `vitest.e2e.config.ts` for E2E tests.
- Migrated all test files:
  - `jest.fn()` → `vi.fn()`
  - `jest.mock()` → `vi.mock()`
  - Runtime `require('./generated/...')` → dynamic `import()`
- Added a small Vite plugin in `vitest.config.ts` to mock `.hbs` template imports during unit tests.
- Regenerated snapshots in Vitest format.

### 3. Node.js 24 minimum

- Added `"engines": { "node": ">=24" }` to `package.json`.
- Updated `.nvmrc` to `v24`.
- Updated `Dockerfile` to `node:24-alpine`.
- Updated `.circleci/config.yml` to `cimg/node:24.0-browsers`.

### 4. Dependency cleanup

- Removed `jest`, `jest-cli`, `@types/jest`, `@babel/cli`, and `esm-config`.
- Added `vitest`, `@vitest/coverage-v8`, `@types/shelljs`, and a local declaration for `api-spec-converter`.
- Made `api-spec-converter` and `shelljs` lazy-loaded inside `convertAndGenerate()` so normal `generate()` calls don't pull them in.

### 5. Bug fixes discovered during migration

- **Config loading**: `esm-config` bundles configs to CJS and then `require`s them, which breaks for ESM-only packages. Replaced it with native `import(pathToFileURL(...))` in `bin/index.js`.
- **TTY handling**: `process.stdout.clearLine` / `cursorTo` are undefined when stdout isn't a TTY (e.g., `npm run`). Added optional chaining guards.
- **Ref-parser schema path**: The hardcoded `process.cwd().split('node_modules')[0]` path to `@apidevtools/json-schema-ref-parser/dist/api-schema.json` broke when the library is consumed from another project. Replaced it with `createRequire(import.meta.url).resolve(...)`.
- **CJS interop**: `fs-extra` named imports don't exist in Node ESM. Switched `src/utils/fileSystem.ts` to a default import.

### 6. Demo project

Added a runnable demo at `../demo-codegen-openapi-ts` showing:
- An ESM `codegen.config.js` using `defineConfig`.
- A sample OpenAPI 3 spec.
- Generating a client.
- Consuming generated types and URL helpers in a TypeScript example.

Run it with:

```bash
cd ../demo-codegen-openapi-ts
npm install
npm run demo
```

## Verification

```bash
npm run validate   # ✅ TypeScript type-check
npm run release    # ✅ Rollup ESM build
npm run test       # ✅ 50 test files, 80 tests passing
```

## Breaking changes for consumers

- The package is now **ESM-only**. Consumers must use `import` instead of `require`.
- Config files should be ESM (`import`/`export`) or use the `.mjs` extension.
- Node.js **≥ 24** is required.

## Notes

- E2E tests are migrated to Vitest syntax and can be invoked with `npm run test:e2e`, but they still fail at runtime due to pre-existing issues in the repo (generated client output doesn't expose the runtime API the tests expect, plus transitive dependency quirks). They were already disabled in CircleCI, so unit tests remain the gating suite.
- A handful of pre-existing ESLint `no-unused-vars` errors remain untouched to keep the migration focused.
