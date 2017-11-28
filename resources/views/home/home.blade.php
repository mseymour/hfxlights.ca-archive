@extends('layouts.app')

@section('content')
<div class="map">
    <div id="map" class="map__object"></div>
    <div id="mapHud" class="map__hud">
        <div class="map__filter filter" data-filter>
            <div class="filter__options">
                <button type="button" class="filter__option filter__button filter__button--geo"><span class="sr-only">Search for</span> Places Near Me</button>
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
