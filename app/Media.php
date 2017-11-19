<?php

namespace App;

use App\Traits\Reportable;
use Spatie\MediaLibrary\Media as BaseMedia;
use Illuminate\Database\Eloquent\Model;

class Media extends BaseMedia
{
    use Reportable;
}
