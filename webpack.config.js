const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const rootAssetPath = './src/';

let pathsToClean = [
  'static/js/'
]

module.exports = {
	entry: {
		reader: [
			rootAssetPath + 'reader'
		]
	},
	output: {
		publicPath: "static/js/",
    	filename: 'reader.[chunkhash].js',
    	path: path.resolve(__dirname, 'static/js')
	},
	watch: true,
	watchOptions: {
		poll: true,
		ignored: /node_modules/
	},
	module : {
		rules: [{
	    	use: {
				loader: 'babel-loader',
				options: {
					presets: ['env', 'react']
	        	}
			}
	    }]
	},
	plugins: [
		// TODO: Dev / Prod Config
		// new webpack.optimize.UglifyJsPlugin(),
        new ManifestRevisionPlugin(path.join('static/js', 'manifest.json'), {
            rootAssetPath: rootAssetPath
        }),
        new CleanWebpackPlugin(pathsToClean)
	],	
};