<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $services = Service::search($search)->latest()->get();

        return Inertia::render('layanan/layanan', [
            'services' => $services,
            'filters' => ['search' => $search ?? ''],
        ]);
    }

    public function show(Service $service, Request $request): Response
    {
        $search = $request->query('search');
        $items = $service->items()->search($search)->latest()->get();

        return Inertia::render('layanan/layanan-items', [
            'service' => $service,
            'items' => $items,
            'filters' => ['search' => $search ?? ''],
        ]);
    }
}
