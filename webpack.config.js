const fs = require('fs');

module.exports = {
    entry: './src/gatsby-node.ts',
    externals: fs.readdirSync('node_modules'),
    mode: 'production',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
                test: /\.(ts|js)?$/,
            },
        ],
    },
    output: {
        filename: 'gatsby-node.js',
        path: __dirname,
    },
    optimization: {
        minimize: false,
    },
    plugins: [],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    target: 'node',
};
