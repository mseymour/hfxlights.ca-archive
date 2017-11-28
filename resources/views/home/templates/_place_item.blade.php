<script id="placeItem" type="text/x-handlebars-template">
@{{#with properties}}
  <div class="place">
    <div class="place__thumb">
    @{{#if thumbnail}}
      <img src="@{{thumbnail}}" alt="@{{title}}">
    @{{else}}
      @svg('hfxlights/thumb')
    @{{/if}}
    </div>
    <div class="place__body">
      <div class="place__content">
        @{{#if title}}
          <h1 class="place__title">@{{title}}</h1>
        @{{else}}
          <h1 class="place__title"></h1>
        @{{/if}}
        @{{#if description}}
          <p class="place__description">@{{description}}</p>
        @{{/if}}
      </div>
      <div class="place__controls">
        <button class="place__favourite favourite" data-favourite-id="@{{id}}" data-favourite-type="@{{type}}">(fav icon) <span>Favourite</span></button>
        <a class="place__show" href="@{{url}}">View Place</a>
      </div>
    </div>
  </div>
@{{/with}}
</script>
