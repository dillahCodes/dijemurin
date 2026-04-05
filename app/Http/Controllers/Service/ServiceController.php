<?php

namespace App\Http\Controllers\Service;

use App\DTOs\Service\ServiceFilterDTO;
use App\DTOs\Service\ServiceItemFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Service\ServiceStoreRequest;
use App\Http\Requests\Service\ServiceUpdateRequest;
use App\Models\Service\Service;
use App\Services\Service\ServiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $filterService = ServiceFilterDTO::fromRequest($request);
        $services = ServiceService::getServicesData($filterService);
        $filters = $filterService->toArray();

        return Inertia::render('layanan/layanan', [
            'services' => $services,
            'filters' => $filters,
        ]);
    }

    public function show(Service $service, Request $request): Response
    {
        $filterServiceItem = ServiceItemFilterDTO::fromRequest($request);
        $items = ServiceService::getServiceItems($service, $filterServiceItem);
        $filters = $filterServiceItem->toArray();

        return Inertia::render('layanan/layanan-items', [
            'service' => $service,
            'items' => $items,
            'filters' => $filters,
        ]);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('layanan.index')->with(['success' => 'Layanan berhasil dihapus']);
    }

    public function store(ServiceStoreRequest $request)
    {
        $validate = $request->validated();

        Service::create($validate);

        return redirect()->route('layanan.index')->with(['success' => 'Layanan berhasil ditambahkan']);
    }

    public function update(ServiceUpdateRequest $request, Service $service)
    {
        $validate = $request->validated();

        $service->update($validate);

        return redirect()->route('layanan.index')->with(['success' => 'Layanan berhasil diupdate']);
    }
}
