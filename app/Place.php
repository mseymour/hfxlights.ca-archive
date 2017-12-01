<?php

namespace App;

use App\Traits\Taggable;
use App\Traits\Favouriteable;
use App\Traits\Reportable;
use Laravel\Scout\Searchable;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use Taggable;
    use Favouriteable;
    use Reportable;
    use Searchable;
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

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();

        $array['_geoloc'] = [
          'lng' => $array['location']->getLng(),
          'lat' => $array['location']->getLat(),
        ];

        unset($array['location'], $array['created_at'], $array['updated_at']);

        $array['tags'] = $this->tags()->pluck('name', 'slug');

        return $array;
    }
}
