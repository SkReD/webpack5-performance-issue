const path = require('path');


/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);




/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require(`terser-webpack-plugin`);


module.exports = {
  mode: 'production',

  cache: {
    type: 'filesystem'
  },

  infrastructureLogging: {
    level: 'info',
    debug: /webpack\.cache.*/,
  },

  entry: `./${process.env.SRC_DIR}/index.js`,

  plugins: [
    new MiniCssExtractPlugin({ filename:'styles.[chunkhash].css' })
  ],

  output: {
    pathinfo: false,
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      options: {
        "plugins": [
          "syntax-dynamic-import",
          "@babel/plugin-proposal-class-properties"
        ],
        "presets": [
            [
                "@babel/preset-env",
                {
                    "modules": false
                }
            ],
            "@babel/preset-react"
        ]
      }
    }, {
      test: /.css$/,

      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: "css-loader",

        options: {
          sourceMap: true
        }
      }]
    }]
  },

  optimization: {
    minimizer: [new TerserPlugin({

    })],
  }
}
