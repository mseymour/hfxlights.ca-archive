<script id="placeItems" type="text/x-handlebars-template">
<div class="popper">
    <div class="map__results results">
        <div class="results__content places">
            <ul>
            @{{#each searchResults}}
                <li>@{{> placeItem this}}</li>
            @{{/each}}
            </ul>
        </div>
        <div class="results__footer">
            <a href="https://algolia.com/" target="_blank">@svg('search-by-algolia', ['height' => 16, 'style' => 'fill:inherit'])</a>
        </div>
    </div>
    <div class="popper__arrow" x-arrow></div>
</div>
</script>
