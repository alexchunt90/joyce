const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path')

module.exports = merge(common, {
	output: {
		publicPath: "/static/js/",
    	filename: '[name].[hash].js',
    	path: path.resolve(__dirname, 'static/js/')
	},	
	// devServer: {
	// 	contentBase: '.',
	// 	hot: true
	// },	
	watch: true,
	watchOptions: {
		poll: true,
		ignored: /node_modules/
	},  
  // new webpack.optimize.UglifyJsPlugin(),
});