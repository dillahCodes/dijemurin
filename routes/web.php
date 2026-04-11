<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Service\ServiceController;
use App\Http\Controllers\Service\ServiceItemController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('laporan', [ReportController::class, 'index'])->name('laporan');

    Route::prefix('layanan')->name('layanan.')->group(function () {
        Route::get('/', [ServiceController::class, 'index'])->name('index');
        Route::post('/', [ServiceController::class, 'store'])->name('store');

        Route::get('/{service}', [ServiceController::class, 'show'])->name('show');
        Route::delete('/{service}', [ServiceController::class, 'destroy'])->name('destroy');
        Route::patch('/{service}', [ServiceController::class, 'update'])->name('update');

        Route::post('/{service}/items', [ServiceItemController::class, 'store'])->name('items.store');
        Route::delete('/{service}/items/{serviceItem}', [ServiceItemController::class, 'destroy'])->name('items.destroy');
        Route::patch('/{service}/items/{serviceItem}', [ServiceItemController::class, 'update'])->name('items.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/order.php';
