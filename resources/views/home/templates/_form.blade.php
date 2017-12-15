<script id="placeFormTemplate" type="text/x-handlebars-template">
    <form action="{{ route('places.store') }}" method="post" enctype="multipart/form-data">
        {{ csrf_field() }}
        <input type="hidden" name="coordinates[lng]" value="@{{coordinates.lng}}">
        <input type="hidden" name="coordinates[lat]" value="@{{coordinates.lat}}">
        <div class="fallback">
            <input name="file" type="file" multiple />
        </div>

        <input type="text" name="name">
        <textarea name="description"></textarea>
        <select name="tags" multiple></select>
    </form>
</script>
