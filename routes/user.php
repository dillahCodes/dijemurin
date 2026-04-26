<?php

use App\Http\Controllers\User\SetPasswordController;
use App\Http\Controllers\User\UserManagementController;

Route::middleware(['auth', 'verified', 'role:super_admin,admin'])->group(function () {
    Route::prefix('pengguna')->name('pengguna.')->group(function () {
        Route::get('/', [UserManagementController::class, 'index'])->name('index');
        Route::get('/tambah', [UserManagementController::class, 'create'])->name('create');
        Route::post('/tambah', [UserManagementController::class, 'store'])->name('store');
        Route::get('/{user}', [UserManagementController::class, 'show'])->name('show');
        Route::get('/{user}/edit', [UserManagementController::class, 'edit'])->name('edit');
        Route::patch('/{user}/edit', [UserManagementController::class, 'update'])->name('update');
    });
});

Route::middleware('guest')->group(function () {
    Route::get('set-password/{token}', [SetPasswordController::class, 'show'])->name('set-password');
});