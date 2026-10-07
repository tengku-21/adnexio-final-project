<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\PackageController;
use Illuminate\Support\Facades\Route;


// For Authentication
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/signup', [AuthController::class, 'signup']);


// Public / guest APIs - public can get
Route::get('/packages', [PackageController::class, 'index']);


// Authenticated APIs
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentication
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Users
    Route::apiResource('users', UserController::class);
    
    
    // Packages
    Route::post('/packages', [PackageController::class, 'store']);
    Route::get('/packages/{package}', [PackageController::class, 'show']);
    Route::put('/packages/{package}', [PackageController::class, 'update']);
    Route::delete('/packages/{package}', [PackageController::class, 'destroy']);
    
    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
    
    // Payments  
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::put('/payments/{payment}', [PaymentController::class, 'update']);

    // Documents
    Route::apiResource('documents', DocumentController::class)
        ->only(['index', 'show', 'store', 'destroy']);
});
