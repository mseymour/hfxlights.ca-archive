<script id="placeItems" type="text/x-handlebars-template">
<div class="map__results">
    <div class="map__content places">
        <ul>
        @{{#each searchResults}}
          <li>@{{> placeItem this}}</li>
        @{{/each}}
        </ul>
    </div>
</div>
</script>
