<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    return response()->file(
        public_path('app/index.html'),
        ['Cache-Control' => 'no-cache'] // so a new build is picked up straight away
    );
})->where('any', '^(?!api(/|$)|storage/|app/).*$');