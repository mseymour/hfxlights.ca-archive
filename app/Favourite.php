<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Favourite extends Model
{
    /**
     * Get all of the owning favouriteable models
     */
    public function favouriteable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user that owns the favourite.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
