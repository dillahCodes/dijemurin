<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Report\ReportController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('laporan', [ReportController::class, 'index'])->name('laporan');
});

require __DIR__.'/settings.php';
require __DIR__.'/order.php';
require __DIR__.'/service.php';
require __DIR__.'/user.php';
require __DIR__.'/outlet.php';
require __DIR__.'/accident.php';
