const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = () => {
    return {
        entry: {
            main: './src/main.tsx'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[chunkhash].js'
        },
        plugins: [
            new HtmlWebpackPlugin({
				hash: true,
				title: "Snake",
				template: path.resolve(__dirname, './src/index.html'),
				filename: path.resolve(__dirname, './index.html')
			}),
            new MiniCssExtractPlugin({
				filename: 'style.css'
			})
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                },
                {
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader'
					],
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'sass-loader'
					],
				},
            ],
        },
        devServer: {
            open: true,
            writeToDisk: true
        }
    }
}