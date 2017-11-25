<?php

namespace App;

use App\Traits\Taggable;
use App\Traits\Favouriteable;
use App\Traits\Reportable;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use Taggable;
    use Favouriteable;
    use Reportable;
    use SpatialTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'location'];

    /**
     * The attributes that are spatial-based
     *
     * @var array
     */
    protected $spatialFields = [
        'location',
    ];
}
