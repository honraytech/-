var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')
var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd
// define the different HOST between development and production environment
var DEV_HOST = JSON.stringify(config.dev.HOST)
var DEV_IMGURL = JSON.stringify(config.dev.imgUrl)
var DEV_WSPORT = JSON.stringify(config.dev.WSPORT)
var PUB_HOST = JSON.stringify(config.build.HOST)
var PUB_IMGURL = JSON.stringify(config.build.imgUrl)
var PUB_WSPORT = JSON.stringify(config.build.WSPORT)
module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      HOST: process.env.NODE_ENV === 'production' ? JSON.stringify(process.env.SUPER_MODEL_SUPER_WEB_API) || PUB_HOST : DEV_HOST,
      imgUrl: process.env.NODE_ENV === 'production' ? JSON.stringify(process.env.SUPER_MODEL_SUPER_WEB_API) || PUB_IMGURL : DEV_IMGURL,
      WSPORT: process.env.NODE_ENV === 'production' ? JSON.stringify(process.env.SUPERMODEL_SWOOLE_PORT) || PUB_WSPORT : DEV_WSPORT
    })
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'v0.0.1': path.resolve(__dirname, '../src/v0.0.1'),
      'config': path.resolve(__dirname, '../src/config'),
      'common': path.resolve(__dirname, '../src/components/Common'),
      'content': path.resolve(__dirname, '../src/components/Content')
    }
  },
  resolveLoader: {
    modules: [path.join(__dirname, '../node_modules')]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
              postcss: [
                require('autoprefixer')({
                  browsers: ['last 2 versions']
                })
              ]
            }
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        include: projectRoot,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: projectRoot,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-3']
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
          }
        ],
        exclude: /loading.svg$/
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
          }
        ]
      }
    ]
  }
}