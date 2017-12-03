@extends('layouts.app')

@section('content')
<form action="{{ route('places.store') }}" accept-charset="utf-8" enctype="multipart/form-data" id="newPlace" class="dropzone">
    <div class="dropzone-previews"></div>

    <div class="form-group">
        <label class="col-form-label" for="name">@lang('places.create.name')</label>
        <input type="text" class="form-control" id="name" name="name" value="{{ old('name') }}">
    </div>

    <div class="form-group">
        <label class="col-form-label" for="description">@lang('places.create.description')</label>
        <textarea class="form-control" id="description" name="description">
            {{ old('description') }}
        </textarea>
    </div>

    <div class="form-group">
        <label class="col-form-label" for="tags">@lang('places.create.tags')</label>
        <select class="form-control" id="tags" name="tags[]" multiple>
        @foreach (old('tags', []) as $value)
            <option value="{{ $value }}">{{ $value }}</option>
        @endforeach
        </select>
    </div>

    <div class="form-group">
        <label class="col-form-label" for="location">@lang('places.create.location')</label>
        <input type="hidden" id="location" name="location" value="{{ old('location') }}">
        <div class="location-map"></div>
    </div>

    <button type="submit" class="btn btn-primary">@lang('places.create.submit')</button>
</form>
@endsection
