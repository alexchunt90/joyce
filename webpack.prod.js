const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')

const pathsToClean = [
  'dist/js'
]

module.exports = merge(common, {
  output: {
    publicPath: "/dist/js/",
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js/')
  },
  optimization: {
  	minimize: true
  },
  plugins: [
  	new CleanWebpackPlugin(pathsToClean),
    new UglifyJSPlugin(),
 	  new BundleAnalyzerPlugin,
	  new webpack.LoaderOptionsPlugin({
		  minimize: true,
	  })
  ]
});