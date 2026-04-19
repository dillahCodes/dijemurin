<?php

namespace App\Services\Outlet;

use App\DTOs\Outlet\OutletFilterDTO;
use App\Http\Resources\Outlet\OutletDetailResource;
use App\Http\Resources\Outlet\OutletResource;
use App\Models\Outlet\Outlet;
use Illuminate\Validation\ValidationException;

class OutletService
{
    /**
     * Get users outles data with filters
     */
    public static function getOutletsData(OutletFilterDTO $filter)
    {
        $users = Outlet::with('user')
            ->search($filter->search)
            ->status($filter->status)
            ->latest()
            ->paginate($filter->limit)
            ->withQueryString();

        return OutletResource::collection($users);
    }

    /**
     * Get outlet detail data
     */
    public static function getOutletDetailData(?string $outletId)
    {
        if (! $outletId) {
            throw ValidationException::withMessages([
                'outlet_id' => 'Outlet ID is required',
            ]);
        }

        $outlet = Outlet::with('user')->findOrFail($outletId);

        return OutletDetailResource::make($outlet);
    }
}
