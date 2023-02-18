import { generateSpecs, readConfigFile } from '../dist/index.js'

async function generateOnConfig () {
  const result = await readConfigFile()
  result.forEach(item => {
    generateSpecs(item)
  });
}

generateOnConfig()
