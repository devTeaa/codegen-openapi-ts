import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/index.js',
		format: 'esm'
	},
	plugins: [
    json(),
    typescript()
  ]
};
