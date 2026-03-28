<?php

namespace App\Http\Controllers\service;

use App\Http\Controllers\Controller;
use App\Http\Requests\service\ServiceItemsStoreRequest;
use App\Http\Requests\service\ServiceItemUpdateRequest;
use App\Models\Service;
use App\Models\ServiceItem;

class ServiceItemController extends Controller
{
    public function destroy(Service $service, ServiceItem $serviceItem)
    {
        $serviceItem->delete();

        return redirect()->route('layanan.show', $service)->with(['success' => 'Price List berhasil dihapus']);
    }

    public function store(ServiceItemsStoreRequest $request)
    {
        $validate = $request->validated();

        ServiceItem::create($validate);

        return redirect()->route('layanan.show', $validate['service_id'])->with(['success' => 'Price List berhasil ditambahkan']);
    }

    public function update(ServiceItemUpdateRequest $request, Service $service, ServiceItem $serviceItem) {
        $validate = $request->validated();

        $serviceItem->update($validate);

        return redirect()->route('layanan.show', $service)->with(['success' => 'Price List berhasil diupdate']);
    }
}
