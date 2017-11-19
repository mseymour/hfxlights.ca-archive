<?php

namespace App\Report;

use App\Report;
use Illuminate\Database\Eloquent\Model;

class Reason extends Model
{
    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
