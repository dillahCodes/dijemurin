<?php

namespace App\Http\Controllers\Service;

use App\DTOs\Service\ServiceItemFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Service\ServiceItemsStoreRequest;
use App\Http\Requests\Service\ServiceItemUpdateRequest;
use App\Models\Service\Service;
use App\Models\Service\ServiceItem;
use App\Services\Service\ServiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceItemController extends Controller
{
    /**
     * Display a listing of the resource (service items).
     */
    public function index(Service $service, Request $request): Response
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

    /**
     * Show the form for creating a new resource.
     */
    public function create(Service $service): Response
    {
        return Inertia::render('layanan/layanan-item-tambah', [
            'service' => $service,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return RedirectResponse
     */
    public function store(ServiceItemsStoreRequest $request)
    {
        $validate = $request->validated();

        $item = ServiceItem::create($validate);

        return redirect()
            ->route('layanan.items.index', $item->service_id)
            ->with(['success' => 'Price List berhasil ditambahkan']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service, ServiceItem $serviceItem): Response
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service, ServiceItem $serviceItem): Response
    {
        $service = ServiceService::getServiceById($service->id);
        $serviceItem = ServiceService::getServiceItemById($serviceItem->id);

        return Inertia::render('layanan/layanan-item-edit', [
            'service' => $service,
            'serviceItem' => $serviceItem,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @return RedirectResponse
     */
    public function update(ServiceItemUpdateRequest $request, Service $service, ServiceItem $serviceItem)
    {
        $validate = $request->validated();

        $serviceItem->update($validate);

        return redirect()
            ->route('layanan.items.index', $serviceItem->service_id)
            ->with(['success' => 'Price List berhasil diupdate']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return RedirectResponse
     */
    public function destroy(Service $service, ServiceItem $serviceItem)
    {
        $serviceItem->delete();

        return redirect()
            ->route('layanan.items.index', $serviceItem->service_id)
            ->with(['success' => 'Price List berhasil dihapus']);
    }
}
