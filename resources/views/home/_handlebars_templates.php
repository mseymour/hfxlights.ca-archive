<script id="placeItem" type="text/x-handlebars-template">
{{#with properties}}
  <div class="place">
    <div class="place__thumb">
    {{#if thumbnail}}
      <img src="{{thumbnail}}" alt="{{title}}">
    {{else}}
      <img src="" alt="{{title}}">
    {{/if}}
    </div>
    <div class="place__body">
      <div class="place__content">
        {{#if title}}
          <h1>{{title}}</h1>
        {{else}}
          <h1></h1>
        {{/if}}
        {{#if description}}
          <p>{{description}}</p>
        {{/if}}
      </div>
      <div class="place__controls">
        <button class="favourite" data-favourite-id="{{id}}" data-favourite-type="{{type}}">(fav icon) <span>Favourite</span></button>
        <a href="{{url}}">View Place</a>
      </div>
    </div>
  </div>
{{/with}}
</script>

<script id="placeItems" type="text/x-handlebars-template">
<div class="map__results">
    <div class="map__content places">
        <ul>
        {{#each searchResults}}
          <li>{{> placeItem this}}</li>
        {{/each}}
        </ul>
    </div>
</div>
</script>
