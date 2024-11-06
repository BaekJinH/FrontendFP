const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,  // SCSS 또는 Sass 파일을 처리하기 위한 정규식
        use: [
          'style-loader',   // JavaScript에서 스타일을 DOM에 삽입
          'css-loader',     // CSS 파일을 JavaScript로 변환
          'sass-loader',    // SCSS/Sass를 CSS로 변환
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '', globOptions: { ignore: ['**/index.html'] } }, // index.html을 복사하지 않도록 설정
      ],
    }),
  ],
  devServer: {
    static: './public',
    open: true,
    port: 3000,
  },
  mode: 'development',
};
