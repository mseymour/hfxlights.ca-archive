@extends('layouts.app')

@section('content')
<div class="map">
  <div id="map" class="map__object"></div>

  <div class="map__overlay" id="mapHud">
    <div class="map__filter filter">
      <button class="filter__option filter__option--add filter__button" type="button">(svg Search icon) <span>Add Place</span></button>
      <button class="filter__option filter__option--geo filter__button" type="button">(svg Search icon) <span><span class="sr-only">Search for</span> Places Near Me</span></button>
      <form class="filter__option filter__option--address" action="{{ route('places.search') }}" method="post">
        <input class="filter__button filter__button--search filter__search" name="q" type="search" placeholder="Search Places" aria-label="Search for places by address">
        <button class="filter__submit" tabindex="-1" type="submit">Search Places</button>
      </form>
    </div>
  </div>
</div>

@include('home.templates._place_item')
@include('home.templates._place_items')
@endsection
