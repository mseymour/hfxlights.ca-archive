<?php

namespace App;

use App\Report\Reason;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    public function reason()
    {
        return $this->belongsTo(Reason::class);
    }
}
