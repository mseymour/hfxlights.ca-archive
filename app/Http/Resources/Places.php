<?php

namespace App\Http\Resources;

use App\Favourite;
use Illuminate\Http\Resources\Json\ResourceCollection;

class Places extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'type' => 'FeatureCollection',
            'features' => $this->collection->transform(function ($place) {
                $favourite = Favourite::select('id')
                    ->where('user_id', auth()->id ?? null)
                    ->where('favouriteable_id', $place->getKey())
                    ->where('favouriteable_type', $place->getMorphClass())
                    ->first();
                return [
                    'type' => 'Feature',
                    'geometry' => [
                        'type' => 'Point',
                        'coordinates' => [
                            $place->location->getLng(),
                            $place->location->getLat(),
                        ],
                    ],
                    'properties' => [
                        'title' => $place->name,
                        'description' => $place->description,
                        'id' => $place->getKey(),
                        'type' => $place->getMorphClass(),
                        'url' => route('places.show', [$place->getRouteKey()]),
                        'favourite_id' => $favourite->id ?? null,
                    ],
                ];
            })->toArray(),
        ];
    }
}
