<div id="controls" data-active-control="filter">
    <div class="map__filter filter" data-control="filter">
        <button class="filter__option filter__option--add filter__button" data-toggle-control="add" type="button">@svg('openiconic/plus', ['width' => 12, 'height' => 12]) <span class="filter__label">Add Place</span></button>
        <button class="filter__option filter__option--geo filter__button" type="button">@svg('openiconic/location', ['width' => 12, 'height' => 12]) <span class="filter__label"><span class="sr-only">Search for Places</span> Near Me</span></button>
        <form class="filter__option filter__option--address" action="{{ route('places.search') }}" method="post">
            <span class="search">
                <input id="mapSearch" class="search__input filter__button filter__button--search filter__search" name="q" type="search" aria-labelledby="searchLabel">
                <span class="search__label" id="searchLabel">@svg('openiconic/magnifying-glass', ['width' => 14, 'height' => 14]) <span class="filter__label"><span class="sr-only">Search for places by</span> Address</span></span>
            </span>
            <button class="filter__submit" tabindex="-1" type="submit">Search Places</button>
        </form>
    </div>

    <div class="map__filter filter" data-control="add" style="display:none;" aria-hidden="true">
        <button class="filter__option filter__option--cancel filter__button" data-toggle-control="filter" type="button">@svg('openiconic/location', ['width' => 12, 'height' => 12]) <span class="filter__label">Cancel</button>
        <button class="filter__option filter__option--continue filter__button" type="button">@svg('openiconic/plus', ['width' => 12, 'height' => 12]) Add Place</button>
    </div>
</div>
