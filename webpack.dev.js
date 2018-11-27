const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	devServer: {
		contentBase: '.',
		hot: true
	},	
	watch: true,
	watchOptions: {
		poll: true,
		ignored: /node_modules/
	},
});