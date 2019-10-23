const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
	entry: {
		app: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		// filename: 'bundle.js',
		filename: '[name].bundle.[hash].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			// {
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	use: {
			// 		loader: 'eslint-loader',
			// 	}
			// },
			{
				test: /\.(s*)css$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader'
				}
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.handlebars$/,
				loader: "handlebars-loader",
				options: {
					helperDirs: path.join(__dirname, 'src/modules/handlebarsHelpers'),
					precompileOptions: {
						knownHelpersOnly: false,
					},
				},}
		]
	},
	resolve: {
		extensions: ['.js'],
	},
	mode: 'development',
	devServer: {
		contentBase: path.join(__dirname, 'src'),
		compress: true,
		port: 9000,
		hot: true,
		historyApiFallback: true,
		// historyApiFallback: {
		// 	rewrites: [
		// { from: /^\/$/, to: '/index.html' },
		// { from: /bundle.js$/, to: '/bundle.js' },
		// { from: /./, to: '/views/404.html' }
		// ],
		// },
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Caching',
			template: "./src/index.html"
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
	optimization: {
		runtimeChunk: 'single',
	},
};
