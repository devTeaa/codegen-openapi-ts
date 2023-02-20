import type { Client } from '../../client/interfaces/Client';
import type { OpenApi } from './interfaces/OpenApi';
import { getModels } from './parser/getModels';
import { getServer } from './parser/getServer';
import { getServices } from './parser/getServices';
import { getServiceVersion } from './parser/getServiceVersion';

/**
 * Parse the OpenAPI specification to a Client model that contains
 * all the models, services and schema's we should output.
 * @param openApi The OpenAPI spec  that we have loaded from disk.
 */
export function parse(openApi: OpenApi, selectedOnly: boolean = false): Client {
    const version = getServiceVersion(openApi.info.version);
    const server = getServer(openApi);
    let models = getModels(openApi);
    const services = getServices(openApi);

    const usedServiceImports = services.map(item => item.imports).flat()
    const usedModelImports = models.map(item => item.imports).flat()
    const removedDups = Array.from(new Set([
      ...usedModelImports,
      ...usedServiceImports
    ]))

    if (selectedOnly) {
      models = models.filter(item => removedDups.some(value => value === item.name))
    }

    return { version, server, models, services };
}
