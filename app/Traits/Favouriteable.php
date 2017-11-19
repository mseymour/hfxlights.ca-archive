<?php

namespace App\Traits;

use App\Favourite;

/**
 * Implements the morphable relationship Favouriteable
 */
trait Favouriteable
{
    /**
     * Get all of the place's favourites
     */
    public function favourites()
    {
        return $this->morphMany(Favourite::class, 'favouriteable');
    }
}
