let mix = require('laravel-mix');
let webpack = require('webpack');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
      }, ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Popper: ['popper.js', 'default'],
      }),
    ],
  }).autoload({
    lodash: ['window._'],
    axios: ['window.axios'],
    'jquery/dist/jquery.slim': ['$', 'jQuery', 'window.jQuery'],
    'popper.js/dist/umd/popper.js': ['Popper']
  })
  .js('resources/assets/js/app.js', 'public/js')
  .sass('resources/assets/sass/app.scss', 'public/css')
  .version()
  .sourceMaps();
