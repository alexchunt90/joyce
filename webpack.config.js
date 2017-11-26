const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const rootAssetPath = './src/'

let pathsToClean = [
  'static/'
]

module.exports = {
	entry: {
		reader: [
			rootAssetPath + 'reader',
			rootAssetPath + 'stylesheets/' + 'reader.scss'
		],
		editor: [
			rootAssetPath + 'editor',
			rootAssetPath + 'stylesheets/' + 'editor.scss'
		],
		notes: [
			rootAssetPath + 'notes',
			rootAssetPath + 'stylesheets/' + 'notes.scss'
		]
	},
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
	module : {
		rules: [
		{
			test: /\.(js)$/,
	    	use: {
				loader: 'babel-loader',
				options: {
					presets: ['env', 'react']
	        	}
			}
		},
		{
			test: /\.(png)$/,
			use: {
				loader: 'file-loader'
			}
		},
		{
		    test: /\.(scss)$/,
		    use: [{
		    	loader: 'style-loader', // inject CSS to page
		    }, {
		    	loader: 'css-loader', // translates CSS into CommonJS modules
		    }, {
		    	loader: 'postcss-loader', // Run post css actions
		    	options: {
		        	plugins: [
		            	require('precss'),
		            	require('autoprefixer')
		          	]
		        }
		    }, {
		      loader: 'sass-loader' // compiles SASS to CSS
		    }]
	    },
	    {
	    	test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
	    	use: [{
	    		loader: 'file-loader'
	    	}]
	    }
    ]},
	plugins: [
		// TODO: Dev / Prod Config
		// new webpack.optimize.UglifyJsPlugin(),
        new ManifestRevisionPlugin(path.join('static/', 'manifest.json'), {
            rootAssetPath: rootAssetPath
        }),
        new webpack.ProvidePlugin({
	        $: 'jquery',
	        jQuery: 'jquery',
	        'window.jQuery': 'jquery',
	        Popper: ['popper.js', 'default']        	
        }),
        new CleanWebpackPlugin(pathsToClean),
	],
};