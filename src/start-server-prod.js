import { server } from 'universal-webpack';
import webpack from 'webpack';
import settings from '../webpack/universal-webpack-settings';
import configuration from '../webpack/webpack.config.prod';

configuration.plugins.push(
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

server(configuration, settings);
