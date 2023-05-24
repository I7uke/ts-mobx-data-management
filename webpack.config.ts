import * as path from 'path';
import * as webpack from 'webpack';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//#region Константы
const DATE_BUILD = new Date();
// Режим разработки
const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development';
//#endregion

const config: webpack.Configuration = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        'index': './src/index.ts',
        'baseStoreEditItem': './src/baseStoreEditItem.ts',
        'baseStoreEditItemsPageContent': './src/baseStoreEditItemsPageContent.ts',
        'baseStoreFilters': './src/baseStoreFilters.ts',
        'baseStorePage': './src/baseStorePage.ts',
        'storeDataSource': './src/storeDataSource.ts',
        'storeDisplayedData': './src/storeDisplayedData.ts',
        'storeSitePageTitle': './src/storeSitePageTitle.ts',
        'uniqueUuid': './src/uniqueUuid.ts',
        'baseStoreReadOnlyItemsPageContent': './src/baseStoreReadOnlyItemsPageContent.ts'
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /(node_module|dist)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        },
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },

        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    output: {
        path: path.resolve('./dist'),
        filename: "[name].js",
        library: {
            type: 'umd',
        },
    }
};

console.log("\x1b[33m%s\x1b[0m", "____________________________________________________");
console.log(DATE_BUILD.toLocaleDateString() + " " + DATE_BUILD.toLocaleTimeString());
console.log("\x1b[33m%s\x1b[0m", "____________________________________________________");

export default config;
