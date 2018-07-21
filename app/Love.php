<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Love extends Model
{
    /**
     * Get all of the owning loveable models.
     */
    public function loveable()
    {
        return $this->morphTo();
    }
}
