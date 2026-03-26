<?php

use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceItemController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('order', 'order/order')->name('order');
    Route::inertia('laporan', 'laporan/laporan')->name('laporan');

    Route::get('layanan', [ServiceController::class, 'index'])->name('layanan.index');
    Route::get('layanan/{service}', [ServiceController::class, 'show'])->name('layanan.show');
    Route::delete('layanan/{service}', [ServiceController::class, 'destroy'])->name('layanan.destroy');
    Route::delete('layanan/{service}/item/{serviceItem}', [ServiceItemController::class, 'destroy'])->name('layanan.item.destroy');
});

require __DIR__.'/settings.php';
