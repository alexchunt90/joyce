const webpack = require('webpack')
const {merge} = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
  	minimize: true,
    // splitChunks: {
    //   chunks: 'all',
    // },
  },
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ]
});