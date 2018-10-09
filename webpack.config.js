const webpack = require('webpack');
const package = require('./package.json');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const contextPath = path.join(__dirname, './src');
const appEnv = process.env.NODE_ENV || 'development';
const isProduction = appEnv == 'production';
const isDevelopment = appEnv == 'development';
const destinationDir = (isProduction) ? `./public` : `./build`;

const config = {

    mode: appEnv,

    context: contextPath,

    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                },
                common: {
                    name: "common",
                    filename: "common.js",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    priority: 1
                }
            }
        }
    },

    entry: {
        app: "app.ts"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],

        modules: [contextPath, "node_modules"],

    },

    output: {
        path: path.resolve(__dirname, destinationDir),
        publicPath: "/",
        chunkFilename: '[name].js',
        filename: '[name].js',
        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: "../tsconfig.json"
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                exclude: /node_modules/,
                options: {
                    formatter: "stylish",
                    configFile: "./tslint.json"
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    {
                        loader: 'css-loader', options: {
                            sourceMap: !isProduction,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: isProduction ? '[hash:base64:5]' : '[name]__[local]___[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'sass-loader', options: {
                            includePaths: [
                                contextPath
                            ]
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin([destinationDir]),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            favicon: './assets/images/favicon.png',
            templateParameters: {
                env: appEnv
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(appEnv),
            'process.env.VERSION': JSON.stringify(package.version)
        })
    ]
};

if (isDevelopment) {
    config.devtool = "eval-source-map";
    config.devServer = {
        historyApiFallback: true,
        host: "0.0.0.0"
    };
}

if (isProduction) {
    config.plugins.push(new SWPrecacheWebpackPlugin({
        cacheId: package.name,
        filename: 'sw.js',
        minify: true,
        staticFileGlobsIgnorePatterns: [/\.map$/],
    }));

    config.plugins.push(new CompressionPlugin());
}

module.exports = config;