import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import * as fs from 'fs';
import * as path from 'path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

function deleteFolder(folderPath) {
	if (!fs.existsSync(folderPath)) {
		return;
	}

	fs.rmSync(folderPath, { recursive: true, force: true });
}

deleteFolder(path.resolve('./dist'));

/** @type {import('rollup').RollupOptions} */
const rollupOptions = {
	input: './src/index.ts',
	output: {
		file: './dist/index.js',
		format: 'es',
		name: 'bundle',
		sourcemap: false
	},
	plugins: [
		peerDepsExternal(),
		resolve(),
		terser(),
		typescript(),
	]
};

export default rollupOptions;