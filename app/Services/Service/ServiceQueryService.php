<?php

namespace App\Services\Service;

use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\DTOs\Service\ServiceFilterDTO;
use App\DTOs\Service\ServiceItemFilterDTO;
use App\Enums\User\UserRole;
use App\Http\Resources\Service\ServiceResource;
use App\Models\Service\Service;
use App\Models\Service\ServiceItem;
use Illuminate\Validation\ValidationException;

class ServiceQueryService
{
    /**
     * get index service with search filter
     */
    public static function getIndexServiceData(ServiceFilterDTO $filter, OutletComboboxFilterDTO $outletFilter)
    {
        $query = Service::with('outlet')->search($filter->search)->latest();

        $user = auth()->user();
        $isSuperAdmin = $user && $user->hasRole(UserRole::SUPER_ADMIN);

        // NOTE: non super admin → force outlet filter (without pagination)
        if (! $isSuperAdmin) {
            if ($user?->outlet_id) {
                $query->where('outlet_id', $user->outlet_id);
            }

            return ServiceResource::collection($query->get());
        }

        // NOTE: super admin flow (with pagination)
        if ($outletFilter->outletIdSelected) {
            $query->where('outlet_id', $outletFilter->outletIdSelected);

            return ServiceResource::collection($query->paginate($filter->limit)->withQueryString());
        }
    }

    /**
     * get service item with search filter
     */
    public static function getServiceItems(Service $service, ServiceItemFilterDTO $filter)
    {
        return $service->items()->search($filter->search)->latest()->get();
    }

    /**
     * get service by id
     */
    public static function getServiceById(?int $id)
    {
        if (! $id) {
            throw ValidationException::withMessages([
                'id' => 'Service ID is required',
            ]);
        }

        return Service::with('outlet')->findOrFail($id);
    }

    /**
     * get service item by id
     */
    public static function getServiceItemById(?int $id)
    {
        if (! $id) {
            throw ValidationException::withMessages([
                'id' => 'Service Item ID is required',
            ]);
        }

        return ServiceItem::findOrFail($id);
    }
}
