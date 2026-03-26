<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceItem;

class ServiceItemController extends Controller
{
    public function destroy(Service $service, ServiceItem $serviceItem)
    {
        $serviceItem->delete();

        return redirect()->route('layanan.show', $service)->with(['success' => 'Price List berhasil dihapus']);
    }
}
