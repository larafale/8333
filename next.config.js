require('dotenv').config();
const webpack = require('webpack');

module.exports = {
  webpack(config, { dev }) {

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV||''),
        'process.env.APP_URL': JSON.stringify(process.env.APP_URL||''),
        'process.env.API_MAINNET': JSON.stringify(process.env.API_MAINNET||''),
        'process.env.API_TESTNET': JSON.stringify(process.env.API_TESTNET||''),
      })
    )
    
    config.plugins.push(new webpack.optimize.DedupePlugin()) //dedupe similar code 
    config.plugins.push(new webpack.optimize.UglifyJsPlugin()) //minify everything
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin()) //Merge chunks

    return config;
  }
}