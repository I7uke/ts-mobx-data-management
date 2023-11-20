import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import * as fs from 'fs';
import * as path from 'path';

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
		peerDepsExternal({

		}),
		replace({
			"process.env.NODE_ENV": JSON.stringify("production")
		}),
		resolve(),
		terser(),
		typescript(),
		commonjs({
			include: /node_modules/,
			requireReturnsDefault: 'auto', // <---- this solves default issue
		})
	]
};

export default rollupOptions;