<?php

use App\Http\Controllers\Order\OrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('order')->name('order.')->group(function () {
    Route::get('/status-check', [OrderController::class, 'customerStatusOrder'])->name('customer.status');
});

Route::middleware(['auth', 'verified'])->prefix('order')->name('order.')->group(function () {
    Route::get('/', [OrderController::class, 'index'])->name('index');
    Route::post('/', [OrderController::class, 'store'])->name('store');

    Route::patch('/{order}', [OrderController::class, 'update'])->name('update');
    Route::get('/{order}', [OrderController::class, 'show'])->name('show');
    Route::get('/{order}/print', [OrderController::class, 'print'])->name('print');
});
