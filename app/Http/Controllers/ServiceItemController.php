<?php

namespace App\Http\Controllers;

use App\Http\Requests\service\ServiceItemsStoreRequest;
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
}
