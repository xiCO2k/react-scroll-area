const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './lib/index.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader?importLoaders=1&modules!postcss-loader'
            ],
            exclude: /node_modules/
        }]
    }
};
