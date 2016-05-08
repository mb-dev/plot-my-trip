var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  watch: true,

  entry: ['babel-polyfill', __dirname + '/client/index.jsx'],

  module: {
    loaders: [
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|env)/,
        include: path.join(__dirname, 'client'),
        loader: 'babel',
      },
      {test: /\.less$/, exclude: /node_modules/, loader: 'style!css!less'},
      {test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass']},
      {test: /\.css$/, exclude: /node_modules/, loader: 'style!css'},
      {test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
    ],
  },

  output: {
    filename: 'index.js',
    path: __dirname + '/static',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  devServer: {
    contentBase: './static',
  },
};
