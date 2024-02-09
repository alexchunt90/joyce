const webpack = require('webpack')
const {merge} = require('webpack-merge')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
  	minimize: true
  }
});