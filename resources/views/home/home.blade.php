@extends('layouts.app')

@section('content')
<div class="map">
    <div id="map" class="map__object"></div>
    <div class="map__filter filter" data-filter>
        <div class="filter__options">
            <button type="button" class="filter__option filter__button filter__button--geo"><span class="sr-only">Search for places</span> Near Me</button>
            <form class="filter__option">
                <input class="filter__search filter__button" type="search" placeholder="Search" aria-label="Search for places by address">
                <button tabindex="-1" class="filter__submit" type="submit">Search</button>
            </form>
        </div>
    </div>
</div>
@endsection
