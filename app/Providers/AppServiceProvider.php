<?php

namespace App\Providers;

use Laravel\Scout\Builder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);

        if (! Builder::hasMacro('aroundLatLng')) {
            // https://scotch.io/tutorials/achieving-geo-search-with-laravel-scout-and-algolia
            Builder::macro('aroundLatLng', function ($lat, $lng, $radius = null) {
                $callback = $this->callback;

                $this->callback = function ($algolia, $query, $options) use ($lat, $lng, $radius, $callback) {
                    $location = [
                        'aroundLatLng' => (float) $lat . ',' . (float) $lng,
                        'aroundRadius' => $radius,
                    ];

                    $options = array_merge($options, $location);

                    if ($callback) {
                        return call_user_func(
                            $callback,
                            $algolia,
                            $query,
                            $options
                        );
                    }

                    return $algolia->search($query, $options);
                };

                return $this;
            });
        }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
