const mix = require('laravel-mix');
const webpack = require('webpack');

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

mix
  .webpackConfig({
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
      }],
      noParse: /(mapbox-gl)\.js$/,
    },
    plugins: [
      new webpack.ProvidePlugin({
        Popper: ['popper.js', 'default'],
      }),
    ],
  })
  .autoload({
    'mapbox-gl': ['mapboxgl'],
    'handlebars/dist/handlebars': ['handlebars'],
    lodash: ['_'],
    axios: ['axios', 'window.axios'],
    'jquery/dist/jquery.slim': ['$', 'jQuery', 'window.jQuery'],
    'popper.js/dist/umd/popper': ['Popper'],
  })
  .js('resources/assets/js/app.js', 'public/js/app.js')
  .extract([
    'mapbox-gl',
    'handlebars/dist/handlebars',
    'lodash',
    'axios',
    'jquery/dist/jquery.slim',
    'popper.js/dist/umd/popper',
  ])
  .sass('resources/assets/sass/app.scss', 'public/css')
  .copyDirectory('resources/assets/images', 'public/images')
  .sourceMaps()
  .version();
