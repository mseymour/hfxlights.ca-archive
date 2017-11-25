<script id="mapPopup" type="text/x-handlebars-template">
  <div class="popup">
    <div class="popup__thumb">
    @verbatim
    {{#if thumbnail}}
      <img src="{{thumbnail}}" alt="{{title}}">
    {{else}}
      <img src="" alt="{{title}}">
    {{/if}}
    @endverbatim
    </div>
    <div class="popup__body">
    @verbatim
      <div class="popup__content">
        {{#if title}}
          <h1>{{title}}</h1>
        {{else}}
          <h1></h1>
        {{/if}}
        {{#if description}}
          <p>{{description}}</p>
        {{/if}}
      </div>
    @endverbatim
      <div class="popup__controls">
        <button class="favourite" data-favourite-id="@{{id}}" data-favourite-type="@{{type}}">(fav icon) <span>Favourite</span></button>
        <a href="@{{url}}">View Place</a>
      </div>
    </div>
  </div>
</script>
