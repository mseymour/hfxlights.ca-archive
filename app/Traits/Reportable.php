<?php

namespace App\Traits;

use App\Report;

/**
 * Implements the morphable relationship Reportable
 */
trait Reportable
{
    /**
     * Get all of the model's reports
     */
    public function reports()
    {
        return $this->morphMany(Report::class, 'favouriteable');
    }
}
