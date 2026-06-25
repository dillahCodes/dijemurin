<?php

namespace App\Services\Outlet;

use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\DTOs\Outlet\OutletFilterDTO;
use App\Enums\User\UserRole;
use App\Http\Resources\Outlet\OutletDetailResource;
use App\Http\Resources\Outlet\OutletResource;
use App\Models\Outlet\Outlet;
use Illuminate\Validation\ValidationException;

class OutletQueryService
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
     * Get users outles data with filters
     */
    public static function getOutletsComboboxData(OutletComboboxFilterDTO $filter)
    {
        $allowedRole = auth()->user()?->hasRole(UserRole::SUPER_ADMIN) ?? false;

        if (! $allowedRole) {
            return OutletResource::collection(collect([]));
        }

        $outlets = Outlet::search($filter->outletSearch)
            ->latest()
            ->paginate($filter->limit)
            ->withQueryString();

        return OutletResource::collection($outlets);
    }

    /**
     * Get outles selected data with filters
     */
    public static function getOutletComboboxSelectedData(OutletComboboxFilterDTO $filter)
    {
        $user = auth()->user();
        $allowedRole = $user?->hasRole(UserRole::SUPER_ADMIN) ?? false;

        // NOTE: non superadmin force search based on they outlet
        if (! $allowedRole) {
            return $user?->outlet ? OutletResource::make($user->outlet) : null;
        }

        // NOTE: superadmin search based on outletIdSelected
        if (! $filter->outletIdSelected) {
            return null;
        }

        $outlet = Outlet::find($filter->outletIdSelected);

        return $outlet ? OutletResource::make($outlet) : null;
    }

    /**
     * Get outlet detail data
     */
    public static function getOutletDetailData(?int $outletId)
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
