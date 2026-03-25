<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $service = Service::all();

        return Inertia::render('layanan/layanan', [
            'services' => $service,
        ]);
    }
}
