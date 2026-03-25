<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $services = Service::search($search)->latest()->get();

        return Inertia::render('layanan/layanan', [
            'services' => $services,
            'filters' => ['search' => $search ?? ''],
        ]);
    }
}
