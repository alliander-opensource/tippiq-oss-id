import { serverConfiguration } from 'universal-webpack'
import settings from './universal-webpack-settings'
import configuration from './webpack.config.prod'
import webpack from 'webpack';

configuration.plugins
.push(
    new webpack.DefinePlugin({
      'process.env':
      {
        NODE_ENV: JSON.stringify('production'),
        BABEL_ENV: JSON.stringify('production/server'),
      },
      __CLIENT__: false,
      __SERVER__: true,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __SSR__: true,
      __DEBUG__: false,
    })
);

export default serverConfiguration(configuration, settings);
