module.exports = {
    entry: './src/entry.js',
    output: {
        filename: './bundle.js'
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
                {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }
            ],
            exclude: /node_modules/
        }, {
            test: /\.(jpe?g|png|gif|svg)/,
            use: ['file-loader'],
            exclude: /node_modules/
        }]
    }
};
