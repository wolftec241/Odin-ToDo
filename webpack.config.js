const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry:'./src/index.js',
    output:{
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader'
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devtool: 'inline-source-map',

    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: "Webpack App",
            filename: 'index.html',
            inject: 'body',
            scriptLoading:'defer'
        })
    ]
};
