const webpack = require('webpack')
const path = require('path')
const ManifestPlugin = require('webpack-manifest-plugin')

const rootAssetPath = './src/'

module.exports = {
	entry: {
		joyce: [
			rootAssetPath + 'joyce',
			rootAssetPath + 'stylesheets/' + 'joyce.scss'
		]
	},
	output: {
		publicPath: "/static/js/",
    	filename: '[name].[hash].js',
    	path: path.resolve(__dirname, 'static/js/')
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
		      loader: 'sass-loader'
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
      new ManifestPlugin()
    ]    
};