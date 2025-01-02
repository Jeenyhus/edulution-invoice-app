const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve('process/browser'),
    zlib: false,
    stream: false,
    util: false,
    buffer: false,
    asset: false,
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ];

  return config;
}; 