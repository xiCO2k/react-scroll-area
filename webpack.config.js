const { resolve } = require('path');

module.exports = {
    entry: './lib/style.css',
    output: {
        filename: './style.js',
        path: resolve(__dirname, 'lib')
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
