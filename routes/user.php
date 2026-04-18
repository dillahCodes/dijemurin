<?php

use App\Http\Controllers\User\UserManagementController;

Route::middleware(['auth', 'verified', 'role:super_admin,admin'])->group(function () {
    Route::prefix('pengguna')->name('pengguna.')->group(function () {
        Route::get('/', [UserManagementController::class, 'index'])->name('index');
    });
});
