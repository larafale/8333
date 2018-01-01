require('dotenv').config();
const webpack = require('webpack');


module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.APP_URL': JSON.stringify(process.env.APP_URL||''),
        'process.env.API_MAINNET': JSON.stringify(process.env.API_MAINNET||''),
        'process.env.API_TESTNET': JSON.stringify(process.env.API_TESTNET||''),
      })
    );

    return config;
  },
};