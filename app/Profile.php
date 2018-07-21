<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model implements HasMedia
{
    use SoftDeletes;
    use HasMediaTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'display_name',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * Get the user associated with the profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function registerMediaCollections()
    {
        $this
            ->addMediaCollection('avatar')
            ->singleFile();

            $this
                ->addMediaCollection('banner')
                ->singleFile();
    }

    public function registerMediaConversions(Media $media = null)
    {
        //
        // Avatar media conversions
        //
        $this->addMediaConversion('mini')
             ->width(24)
             ->height(24)
             ->sharpen(10)
             ->performOnCollections('avatar');
        $this->addMediaConversion('normal')
             ->width(48)
             ->height(48)
             ->sharpen(10)
             ->performOnCollections('avatar');
        $this->addMediaConversion('bigger')
             ->width(73)
             ->height(73)
             ->sharpen(10)
             ->performOnCollections('avatar');

        //
        // Banner media conversions
        //
        $this->addMediaConversion('background')
             ->blur(50)
             ->performOnCollections('banner');
    }
}
