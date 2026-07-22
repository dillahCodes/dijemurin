<?php

use App\Http\Controllers\Accident\AccidentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('accidents', [AccidentController::class, 'index'])->name('accidents.index');
    Route::get('accidents/create', [AccidentController::class, 'create'])->name('accidents.create');
    Route::get('accidents/{accident}', [AccidentController::class, 'show'])->name('accidents.show');
    Route::get('accidents/{accident}/edit', [AccidentController::class, 'edit'])->name('accidents.edit');
    Route::post('accidents', [AccidentController::class, 'store'])->name('accidents.store');
    Route::patch('accidents/{accident}', [AccidentController::class, 'update'])->name('accidents.update');
});
