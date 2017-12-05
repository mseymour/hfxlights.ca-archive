<!doctype html>
<html lang="{{ app()->getLocale() }}">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'HFXLights') }}</title>

    <!-- Styles -->
    <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.42.1/mapbox-gl.css" rel="stylesheet">
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
  </head>
  <body>
    <div id="app" class="container-fluid">
        @include('layouts._header')
        @yield('content')
        @include('layouts._footer')
    </div>

    <script src="{{ mix('js/manifest.js') }}"></script>
    <script src="{{ mix('js/vendor.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>
  </body>
</html>
