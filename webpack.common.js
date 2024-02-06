 const webpack = require('webpack')
const path = require('path')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const Dotenv = require('dotenv-webpack');
// const CopyPlugin = require("copy-webpack-plugin");


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
					presets: ['@babel/preset-env', '@babel/preset-react']
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
		    }, {
		      loader: 'sass-loader'
		    }]
	    },
	    {
	    	test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, 	
  			type: 'asset/resource',
    		dependency: { not: ['url'] },
	    }
    ]},
    plugins: [
      new WebpackManifestPlugin(),
   		new Dotenv(),
   		// new CopyPlugin({
	    //   patterns: [
	    //     { from: "source", to: "dest" },
	    //   ],
    	// }),
    ]
};