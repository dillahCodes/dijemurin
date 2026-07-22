<?php

namespace App\Http\Controllers\Service;

use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\DTOs\Outlet\OutletFilterDTO;
use App\DTOs\Service\ServiceFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Service\ServiceStoreRequest;
use App\Http\Requests\Service\ServiceUpdateRequest;
use App\Models\Service\Service;
use App\Services\Outlet\OutletQueryService;
use App\Services\Service\ServiceQueryService;
use App\Services\Service\ServiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of the services.
     */
    public function index(Request $request): Response
    {
        $filterService = ServiceFilterDTO::fromRequest($request);
        $filterOutlet = OutletComboboxFilterDTO::fromRequest($request);

        $filtersService = $filterService->toArray();
        $filtersOutlet = $filterOutlet->toArray();
        $mergedFilters = [...$filtersService, ...$filtersOutlet];

        $services = ServiceQueryService::getIndexServiceData($filterService, $filterOutlet);
        $outlets = OutletQueryService::getOutletsComboboxData($filterOutlet);
        $outletSelected = OutletQueryService::getOutletComboboxSelectedData($filterOutlet);

        return Inertia::render('layanan/layanan', [
            'services' => $services,
            'filters' => $mergedFilters,
            'outlets' => $outlets,
            'outletSelected' => $outletSelected,
        ]);
    }

    /**
     * Show the form for creating a new service.
     */
    public function create(Request $request): Response
    {
        $filterCombobox = OutletComboboxFilterDTO::fromRequest($request);
        $outlets = OutletQueryService::getOutletsComboboxData($filterCombobox);

        return Inertia::render('layanan/layanan-tambah', [
            'outlets' => $outlets,
        ]);
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(ServiceStoreRequest $request): RedirectResponse
    {
        $validate = $request->validated();
        ServiceService::createService($validate);

        return redirect()->route('layanan.index')->with(['success' => 'Layanan berhasil ditambahkan']);
    }

    /**
     * Display the specified service detail page.
     */
    public function show(Service $service, Request $request): Response
    {
        //
    }

    /**
     * Show the form for editing the specified service.
     */
    public function edit(Service $service, Request $request): Response
    {
        $filterOutlet = OutletFilterDTO::fromRequest($request);
        $outlets = OutletQueryService::getOutletsData($filterOutlet);
        $serviceData = ServiceQueryService::getServiceById($service->id);

        return Inertia::render('layanan/layanan-edit', [
            'service' => $serviceData,
            'outlets' => $outlets,
        ]);
    }

    /**
     * Update the specified service in storage.
     *
     * @return RedirectResponse
     */
    public function update(ServiceUpdateRequest $request, Service $service)
    {
        ServiceService::updateService($service, $request->validated());

        return redirect()->route('layanan.index')->with(['success' => 'Layanan berhasil diupdate']);
    }

    /**
     * Remove the specified service from storage.
     *
     * @return RedirectResponse
     */
    public function destroy(Service $service)
    {
        ServiceService::deleteService($service);

        return redirect()->route('layanan.index', ['outletIdSelected' => $service->outlet_id])->with(['success' => 'Layanan berhasil dihapus']);
    }
}
