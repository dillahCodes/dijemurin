<?php

use App\Http\Controllers\ServiceController;
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
});

require __DIR__.'/settings.php';
