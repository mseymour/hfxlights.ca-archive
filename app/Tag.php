<?php

namespace App;

use App\Place;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    /**
     * Get all of the places that are assigned this tag.
     */
    public function places()
    {
        return $this->morphedByMany(Place::class, 'taggable');
    }
}
