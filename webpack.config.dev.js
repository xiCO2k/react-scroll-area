const webpack = require('webpack');

module.exports = {
    entry: './src/entry.js',
    output: {
        filename: './dist/bundle.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader?importLoaders=1&modules'
            ],
            exclude: /node_modules/
        }]
    }
};