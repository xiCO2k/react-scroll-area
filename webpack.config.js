const webpack = require('webpack');

module.exports = {
    entry: './lib/style.css',
    output: {
        filename: './lib/style.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ],
            exclude: /node_modules/
        }]
    }
};
