var webpack = require('webpack');
var fs = require('fs');
var BASE_CSS_LOADER = 'css?sourceMap&-minimize';
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

// Add any packge names here whose styles need to be treated as CSS modules.
// These paths will be combined into a single regex.
var PATHS_TO_TREAT_AS_CSS_MODULES = [
  '/assets/'.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&')
]

var isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length
var cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES.join('|')})`)
var cssModulesLoader = [
  BASE_CSS_LOADER,
  'modules',
  'importLoaders=2',
  'localIdentName=[name]__[local]___[hash:base64:5]'
].join('&')

/*--------- */

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
var reactTransform = null;
for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  var plugin = babelLoaderQuery.plugins[i];
  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
    reactTransform = plugin;
  }
}

if (!reactTransform) {
  reactTransform = ['react-transform', {transforms: []}];
  babelLoaderQuery.plugins.push(reactTransform);
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
  reactTransform[1] = Object.assign({}, reactTransform[1], {transforms: []});
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
});




/* --- */


module.exports = function (config) {
  config.set({

    browsers: ['PhantomJS'],

    singleRun: true,

    frameworks: [ 'mocha' ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests.webpack.js',
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap'],
      'src/**/*.js': [ 'webpack'],
    },

    reporters: [ 'mocha', 'coverage', 'junit' ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-sourcemap-loader"),
      require("karma-coverage"),
      require("karma-junit-reporter"),
    ],

    coverageReporter: {
      dir: 'reports/karma-coverage/',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'text-summary' },
      ]
    },

    // the default configuration
    junitReporter: {
      outputDir: 'reports/karma-junit', // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      properties: {}, // key value pair of properties to add to the <properties> section of the report
      xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
          {
            test: /^((?!config).)*\.(js|jsx)$/,
            exclude: /node_modules/,
            loaders: ['babel?' + JSON.stringify(babelLoaderQuery)],
          },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.less$/, loader: 'style!css!less' },
          {
            test: /\.css$/,
            include: cssModulesRegex,
            loaders: [
              'style',
              cssModulesLoader,
              'postcss',
              'autoprefixer?browsers=last 2 version'
            ]
          },
          {
            test: /\.scss$/,
            include: cssModulesRegex,
            loaders: [
              'style',
              cssModulesLoader,
              'postcss',
              'sass?sourceMap',
              'autoprefixer?browsers=last 2 version'
            ]
          },
          {
            test: /\.scss$/,
            exclude: cssModulesRegex,
            loaders: [
              'style',
              BASE_CSS_LOADER,
              'postcss',
              'sass?sourceMap'
            ]
          },
          {
            test: /\.css$/,
            exclude: cssModulesRegex,
            loaders: [
              'style',
              BASE_CSS_LOADER,
              'postcss'
            ]
          }
        ],
      },
      progress: true,
      resolve: {
        modulesDirectories: [
          'src',
          'node_modules',
        ],
        extensions: ['', '.json', '.js', '.jsx'],
      },
      plugins: [
        new webpack.DefinePlugin
        ({
          'process.env':
          {
            NODE_ENV: JSON.stringify('development'),
            BABEL_ENV: JSON.stringify('development/client')
          },
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: false,
          __DEVTOOLS__: true,
          __SSR__: true,
          __DEBUG__: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
      ],
    },

    webpackServer: {
      noInfo: true,
    }

  });
};
