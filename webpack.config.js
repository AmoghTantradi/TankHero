const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: './client/index.js',
    output: {
        filename: 'client.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [{
            loader: MiniCssExtractPlugin.loader
          },'css-loader']
        }
       
      ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].bundle.css',
          chunkFilename: '[id].css'
        })
      ],
   //   devtool: 'cheap-eval-source-map',
      mode: 'development'
  };