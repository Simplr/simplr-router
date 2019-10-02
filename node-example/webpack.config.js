const path = require('path');

module.exports =   [{
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve:{
    modules:[
      path.resolve(__dirname),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src/views'),
      path.resolve(__dirname, 'src/guards'),
    ],
    extensions: ['.js', '.json']
  },
  mode: 'production',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true

  },
  module: {
    rules: [
      {
        test:/\.html$/,
        use:[
          {loader: 'babel-loader'},
          {loader: 'polymer-webpack-loader'}
        ]
      }
    ]
  },
}];
