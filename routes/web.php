<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController');

Auth::routes();

Route::resource('places', 'PlaceController')->only(['index', 'create', 'store', 'show']);
Route::resource('places/{place}/favourite', 'FavouriteController')->only(['store', 'destroy']);
