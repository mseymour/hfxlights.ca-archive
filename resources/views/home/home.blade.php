@extends('layouts.app')

@section('content')
<div class="map">
    <div id="map" class="map__object"></div>
    <div id="mapHud" class="map__hud">
        <div class="map__filter filter" data-filter>
            <div class="filter__options">
                <button type="button" class="filter__option filter__button filter__button--geo">(svg Search icon) <span class="filter__label"><span class="sr-only">Search for</span> Places Near Me</span></button>
                <button type="button" class="filter__button add-place">(svg Search icon) <span class="filter__label">Add Place</span></button>
                <form class="filter__option filter__option--address" action="{{ route('places.search') }}" method="post">
                    <input name="q" class="filter__search filter__button" type="search" placeholder="Search Places" aria-label="Search for places by address">
                    <button tabindex="-1" class="filter__submit" type="submit">Search Places</button>
                </form>
            </div>
        </div>
    </div>
    @include('home.templates._place_item')
    @include('home.templates._place_items')
</div>
@endsection
