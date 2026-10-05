<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;


// For Authentication
Route::post('/auth/login', [AuthController::class, 'login']);


// Public / guest APIs - public can get
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/payments', [PaymentController::class, 'store']);


// Authenticated APIs
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Users
    Route::apiResource('users', UserController::class);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::delete('/orders/{order}', [OrderController::class, 'destroy']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);
    Route::put('/payments/{payment}', [PaymentController::class, 'update']);

    // Documents
    Route::apiResource('documents', DocumentController::class)
        ->only(['index', 'show', 'store', 'destroy']);
});
