<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Illuminate\Database\Eloquent\Model;

class Place extends Model implements HasMedia
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
     * Get the user associated with the place
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all of the places's loves.
     */
    public function loves()
    {
        return $this->morphMany(Love::class, 'loveable');
    }

    public function registerMediaConversions(Media $media = null)
    {
        //
        // Place media conversions
        //
        // $this->addMediaConversion('mini')
        //      ->width(24)
        //      ->height(24)
        //      ->sharpen(10);
    }
}
