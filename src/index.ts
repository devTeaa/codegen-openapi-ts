import path from "path"
import esmConfig from 'esm-config'
import axios from "axios";
import { OpenApiJson } from "./open-api-json";
import { getPathKeyProps, getSchemasKeyProps, resolveRefs } from "./utils/getSchemas";
import { CodegenWithMappingConfig, CodegenWithoutMappingConfig } from "./user-config";

function defineConfig (config: (CodegenWithMappingConfig | CodegenWithoutMappingConfig)[]) {
  return config
}

async function readConfigFile (): Promise<(CodegenWithMappingConfig | CodegenWithoutMappingConfig)[]> {
  const rootPath = process.cwd()
  const filePath = path.resolve(rootPath, 'codegen.config.js')
  // const fileText = readFileSync(filePath, 'utf-8')

  const userConfig = await esmConfig(filePath)

  return Promise.resolve(userConfig)
}

async function generateSpecs (config: (CodegenWithMappingConfig | CodegenWithoutMappingConfig)) {
  const jsonData = await axios.get(config.source).then(res => res.data) as OpenApiJson

  const resolvedSchemasRefs = resolveRefs(getSchemasKeyProps(jsonData.components.schemas))
  // console.log(JSON.stringify(resolvedSchemasRefs))
}

export {
  defineConfig,
  readConfigFile,
  generateSpecs
}
