const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const pathsToClean = [
  'static/js'
]

module.exports = merge(common, {
	output: {
		publicPath: "/static/js/",
    	filename: '[name].[hash].js',
    	path: path.resolve(__dirname, 'static/js/')
	},	
	watch: true,
	watchOptions: {
		poll: true,
		ignored: /node_modules/
	},
	plugins: [
        new CleanWebpackPlugin(pathsToClean),
	]	
});