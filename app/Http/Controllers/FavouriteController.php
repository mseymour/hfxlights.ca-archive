<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use App\Favourite;
use Illuminate\Http\Request;

class FavouriteController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Database\Eloquent\Model  $place
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Model $model)
    {
        $model->favourites()->firstOrCreate(['user_id' => auth()->id]);

        if ($request->ajax()) {
            return [];
        } else {
            return back()->with('status', 'Favourited!');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Favourite  $favourite
     * @return \Illuminate\Http\Response
     */
    public function destroy(Favourite $favourite)
    {
        $favourite->delete();

        if ($request->ajax()) {
            return [];
        } else {
            return back()->with('status', 'Unfavourited!');
        }
    }
}
