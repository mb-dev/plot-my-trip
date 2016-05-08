var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  watch: true,

  entry: ['babel-polyfill', __dirname + '/client/index.jsx'],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|env)/,
        include: path.join(__dirname, 'client'),
        loader: 'babel',
      },
      {test: /\.less$/, exclude: /node_modules/, loader: 'style!css!less'},
      {test: /\.css$/, exclude: /node_modules/, loader: 'style!css'},
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
