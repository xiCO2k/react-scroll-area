const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './lib/index.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ['style-loader', {
                loader: 'css-loader',
                query: {
                    modules: true
                }
            }],
            exclude: /node_modules/
        }]
    }
};
