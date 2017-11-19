<?php

namespace App;

use App\Traits\Taggable;
use App\Traits\Favouriteable;
use App\Traits\Reportable;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use Taggable;
    use Favouriteable;
    use Reportable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'location'];
}
