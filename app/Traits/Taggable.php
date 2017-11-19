<?php

namespace App\Traits;

use App\Tag;

/**
 * mplements the morphable-to-many relationship Taggable
 */
trait Taggable
{
    /**
     * Get all of the tags for the post.
     */
    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
