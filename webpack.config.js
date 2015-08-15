var webpack = require('webpack');

module.exports = {
  context: __dirname + "/client",
  entry: {
    index: __dirname + "/client/index.jsx",
    vendor: ["react", "flux"]
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.less$/, exclude: /node_modules/, loader: "style!css!less"}
    ]
  },

  output: {
    filename: "index.js",
    path: __dirname + "/static",
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
