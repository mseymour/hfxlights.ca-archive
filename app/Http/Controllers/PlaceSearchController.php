<?php

namespace App\Http\Controllers;

use App\Place;
use Illuminate\Http\Request;

class PlaceSearchController extends Controller
{
    /**
     * Search for places using a given term
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        if (request()->ajax()) {
            return new Places(Place::all());
        } else {
            return redirect('/');
        }
    }
}
