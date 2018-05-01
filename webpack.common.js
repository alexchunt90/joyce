// const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const rootAssetPath = './src/'

module.exports = {
	entry: {
		joyce: [
			rootAssetPath + 'joyce',
			rootAssetPath + 'stylesheets/' + 'joyce.scss'
		]
	},
	module : {
		rules: [
		{
			test: /\.(js)$/,
			exclude: [
				/node_modules/,
				/\.DS_Store/
			],		
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
			exclude: [
				/node_modules/,
				/\.DS_Store/
			],	    
		    use: [{
		    	loader: 'style-loader',
		    }, {
		    	loader: 'css-loader',
		    }, {
		    	loader: 'postcss-loader',
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
        new ManifestRevisionPlugin(path.join('static/', 'manifest.json'), {
            rootAssetPath: rootAssetPath
        }),
        // new webpack.ProvidePlugin({
        	// bootstrap: 'bootstrap'
	        // $: 'jquery',
	        // jQuery: 'jquery',
	       //  'window.jQuery': 'jquery',
	       //  Popper: ['popper.js', 'default']        	
        // }),
	],
};