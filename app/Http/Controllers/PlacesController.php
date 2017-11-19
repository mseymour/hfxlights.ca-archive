<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PlacesController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }
}
