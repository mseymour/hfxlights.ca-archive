@extends('layouts.app')

@section('content')
<div class="map">
  <div id="map" class="map__object"></div>

  <div class="map__overlay" id="mapHud">
    @include('home._map_overlay')
  </div>
</div>

@include('home.templates._place_marker')
@include('home.templates._place_item')
@include('home.templates._place_items')
@endsection
