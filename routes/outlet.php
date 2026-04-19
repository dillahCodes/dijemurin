<?php

use App\Http\Controllers\Outlet\OutletController;

Route::middleware(['auth', 'verified', 'role:super_admin'])->group(function () {
    Route::prefix('outlet')->name('outlet.')->group(function () {
        Route::get('/', [OutletController::class, 'index'])->name('index');
        Route::get('/{outlet}', [OutletController::class, 'show'])->name('show');
    });
});
