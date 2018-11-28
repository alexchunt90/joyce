const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

module.exports = merge(common, {
  optimization: {
  	minimize: true
  },
  plugins: [
    new UglifyJSPlugin(),
 	  new BundleAnalyzerPlugin,
	  new webpack.LoaderOptionsPlugin({
		  minimize: true,
	  })
  ]
});