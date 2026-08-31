const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

// `npm run stage` passes `--env staging` to build against .env.staging;
// `npm run watch` passes nothing and uses .env as-is.
module.exports = (env = {}) => merge(common(env.staging ? 'staging' : undefined), {
	mode: 'development',
	devtool: 'source-map',
	watch: true,
	watchOptions: {
		poll: true,
		ignored: /node_modules/
	},
})
