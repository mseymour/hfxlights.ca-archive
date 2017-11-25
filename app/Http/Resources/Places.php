<?php

namespace App\Http\Resources;

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
                    ],
                ];
            })->toArray(),
        ];
    }
}
