const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Адрес backend-сервера (REST endpoint /messages/unread).
// Локально: http://localhost:3000
// Продакшн (GitHub Pages): задаётся через env SERVER_URL
// (в GitHub Actions — переменная vars.SERVER_URL, см. .github/workflows/deploy.yml)
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[contenthash].js',
    clean: true,
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      SERVER_URL: JSON.stringify(SERVER_URL),
    }),
  ],
  devServer: {
    port: 8080,
    hot: true,
    open: false,
  },
};
