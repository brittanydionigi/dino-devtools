var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: ['./main.scss', './public/js/main.js', './public/assets/img/star.png'],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif)$/i,   //to support eg. background-image property 
        loader:"file-loader",
        query:{
          name:'[name].[ext]',
          outputPath:'../img/'
          //the images will be emmited to public/assets/images/ folder 
          //the images will be put in the DOM <style> tag as eg. background: url(assets/images/image.png); 
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,        
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader?sourceMap', options: { sourceMap: true }},
            { loader: 'sass-loader?sourceMap', options: { sourceMap: true }}
          ]
        })
      }
    ]
  },
  plugins: [
      new ExtractTextPlugin({ 
        filename: 'assets/css/main.css',
        allChunks: true
      })
    ]
};