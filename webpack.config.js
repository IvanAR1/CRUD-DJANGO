const port = 9090
const path = require('path')
const url = 'http://localhost'
const { webpack, ProvidePlugin } = require('webpack')
const BundleTracker = require("webpack-bundle-tracker")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = (process.env.DEBUG || "false").toLowerCase() == "true"

module.exports = {
    target: 'web',
    context: path.resolve(),
    mode: isDev ? 'development' : 'production',
    entry:{
        main:["./assets/scripts/index.js", "./assets/styles/index.scss"],
    },
    output: {
        filename: '[name]-[fullhash].js',
        path: path.resolve(__dirname, 'core', 'static'),
        clean: true,
        publicPath: isDev ? `${url}:${port}/static/` : '/static/',
    },
    devServer: {
        port: port,
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    },
    devtool: isDev ? 'eval' : 'source-map',
    plugins: [
        new BundleTracker({path: __dirname, filename: 'webpack-stats.json'}),
        new MiniCssExtractPlugin({
            filename: '[name]-[fullhash].css',
            chunkFilename: '[id]-[fullhash].css',
        }),
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Swal:"sweetalert2/dist/sweetalert2.js",
            Alpine:"alpinejs",
            bootstrap:"bootstrap",
        })
    ],
    module:{
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev
                        }
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset',
                generator: {
                    filename: 'fonts/en/[hash][ext][query]',
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
}