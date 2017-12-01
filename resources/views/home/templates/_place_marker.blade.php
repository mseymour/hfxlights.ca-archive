<script id="placeMarker" type="text/x-handlebars-template">
@{{#with properties}}
@{{#if thumbnail}}
    <img src="@{{thumbnail}}" alt="@{{title}}">
@{{else}}
    @svg('hfxlights/thumb')
@{{/if}}
    <button type="button">View Place</button>
    <button type="button">Get Directions</button>
@{{/with}}
</script>
