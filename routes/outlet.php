<?php

use App\Http\Controllers\Outlet\OutletController;

Route::middleware(['auth', 'verified', 'role:super_admin'])->group(function () {
    Route::prefix('outlet')->name('outlet.')->group(function () {
        Route::get('/', [OutletController::class, 'index'])->name('index');
        Route::get('/tambah', [OutletController::class, 'create'])->name('create');
        Route::post('/tambah', [OutletController::class, 'store'])->name('store');
        Route::get('/{outlet}', [OutletController::class, 'show'])->name('show');
        Route::get('/{outlet}/edit', [OutletController::class, 'edit'])->name('edit');
        Route::patch('/{outlet}/edit', [OutletController::class, 'update'])->name('update');
    });
});
