var CleanWebpackPlugin = require('clean-webpack-plugin');
let HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: '[hash].js',
        path: __dirname + '/dist'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015'],
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|)$/,
                loader: 'file-loader?name=img/[name].[ext]'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'sass-loader']
                })
            },
            {
                test: /\.hbs/,
                loader: 'handlebars-loader'
            }
            
        ]
    },
    plugins: [
        new HtmlPlugin({
            title: 'VK plagin',
            template: './src/index.hbs',
            chunks: ['main']
        }),
        new ExtractTextPlugin('style.[hash:5].css'),
        new LiveReloadPlugin(),
        new CleanWebpackPlugin(['dist']/*, {
            verbose: true
        }*/)
    ]
};