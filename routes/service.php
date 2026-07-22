<?php

use App\Http\Controllers\Service\ServiceController;
use App\Http\Controllers\Service\ServiceItemController;

Route::middleware(['auth', 'verified'])->prefix('layanan')->name('layanan.')->group(function () {

    // Service Management Routes
    Route::controller(ServiceController::class)->group(function () {
        Route::get('/', 'index')->name('index')->middleware('role:super_admin,admin,cashier');

        Route::middleware('role:super_admin,admin')->group(function () {
            Route::get('/tambah', 'create')->name('create');
            Route::post('/tambah', 'store')->name('store');
            Route::get('/{service}/edit', 'edit')->name('edit');
            Route::patch('/{service}', 'update')->name('update');
            Route::delete('/{service}', 'destroy')->name('destroy');
        });
    });

    // Service Item Management Routes
    Route::prefix('{service}/items')->name('items.')->controller(ServiceItemController::class)->group(function () {
        Route::get('/', 'index')->name('index')->middleware('role:super_admin,admin,cashier');

        Route::middleware('role:super_admin,admin')->group(function () {
            Route::get('/tambah', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('/{serviceItem}/edit', 'edit')->name('edit');
            Route::patch('/{serviceItem}', 'update')->name('update');
            Route::delete('/{serviceItem}', 'destroy')->name('destroy');
        });
    });
});
