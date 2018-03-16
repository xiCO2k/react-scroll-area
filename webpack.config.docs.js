const { resolve } = require('path');

module.exports = {
    entry: [
        './src/entry.js',
        './index.html'
    ],
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'docs'),
        publicPath: ''
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
        }, {
            test: /\.(jpe?g|png|gif|svg)/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }],
            exclude: /node_modules/
        }, {
            test: /\.html/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }],
            exclude: /node_modules/
        }]
    }
};
