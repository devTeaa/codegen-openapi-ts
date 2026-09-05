import fetch from 'node-fetch';

import { generate, HttpClient } from '../dist/index.js';

const generateSpec = async (input, output) => {
    await generate({
        input,
        output,
        httpClient: HttpClient.FETCH,
        useOptions: true,
        useUnionTypes: false,
        exportCore: true,
        exportSchemas: true,
        exportModels: true,
        exportServices: true,
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateRealWorldSpecs = async () => {
    const response = await fetch('https://api.apis.guru/v2/list.json');

    const list = await response.json();
    delete list['api.video'];
    delete list['apideck.com:vault'];
    delete list['amazonaws.com:mediaconvert'];
    delete list['bungie.net'];
    delete list['docusign.net'];
    delete list['googleapis.com:adsense'];
    delete list['googleapis.com:servicebroker'];
    delete list['kubernetes.io'];
    delete list['microsoft.com:graph'];
    delete list['presalytics.io:ooxml'];
    delete list['stripe.com'];

    const specs = Object.entries(list).map(([name, api]) => {
        const latestVersion = api.versions[api.preferred];
        return {
            name: name
                .replace(/^[^a-zA-Z]+/g, '')
                .replace(/[^\w\-]+/g, '-')
                .trim()
                .toLowerCase(),
            url: latestVersion.swaggerYamlUrl || latestVersion.swaggerUrl,
        };
    });

    for (let i = 0; i < specs.length; i++) {
        const spec = specs[i];
        await generateSpec(spec.url, `./test/generated/${spec.name}/`);
    }
};

const main = async () => {
    await generateSpec('./test/spec/v2.json', './test/generated/v2/');
    await generateSpec('./test/spec/v3.json', './test/generated/v3/');
    // await generateRealWorldSpecs();
};

main();
