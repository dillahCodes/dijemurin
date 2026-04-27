<?php

namespace App\Services\Outlet;

use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\DTOs\Outlet\OutletFilterDTO;
use App\Enums\Outlet\OutletStatus;
use App\Enums\User\UserRole;
use App\Helpers\RoleHelper;
use App\Http\Resources\Outlet\OutletDetailResource;
use App\Http\Resources\Outlet\OutletResource;
use App\Models\Outlet\Outlet;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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
     * Get users outles data with filters
     */
    public static function getOutletsComboboxData(OutletComboboxFilterDTO $filter)
    {
        $allowedRole = RoleHelper::isRole(UserRole::SUPER_ADMIN);

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
    public static function getOutletSelected(OutletComboboxFilterDTO $filter)
    {
        $user = auth()->user();
        $allowedRole = RoleHelper::isRole(UserRole::SUPER_ADMIN);

        // NOTE: non superadmin force search based on they outlet
        if (! $allowedRole) {
            return $user?->outlet
                ? OutletResource::make($user->outlet)
                : null;
        }

        // NOTE: superadmin search based on outletIdSelected
        if (! $filter->outletIdSelected) {
            return null;
        }

        $outlet = Outlet::find($filter->outletIdSelected);

        return $outlet
            ? OutletResource::make($outlet)
            : null;
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

    /**
     * create outlet
     */
    public static function createOutlet(array $data)
    {
        return DB::transaction(function () use ($data) {
            $outlet = Outlet::create([
                'name' => $data['name'] ?? null,
                'address' => $data['address'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
            ]);

            if (! empty($data['admin'])) {
                User::where('id', $data['admin'])->update([
                    'outlet_id' => $outlet->id,
                    'role' => UserRole::ADMIN,
                ]);
            }

            if (! empty($data['cashiers'])) {
                User::whereIn('id', $data['cashiers'])->update([
                    'outlet_id' => $outlet->id,
                    'role' => UserRole::CASHIER,
                ]);
            }

            if (! empty($data['operators'])) {
                User::whereIn('id', $data['operators'])->update([
                    'outlet_id' => $outlet->id,
                    'role' => UserRole::OPERATOR,
                ]);
            }

            return $outlet;
        });
    }

    /**
     * update outlet
     */
    public static function updateOutlet(Outlet $outlet, array $data)
    {
        return DB::transaction(function () use ($outlet, $data) {
            $outlet->update([
                'name' => $data['name'] ?? null,
                'address' => $data['address'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? OutletStatus::ACTIVE,
            ]);

            // NOTE: kumpulkan user id yang mau di ubah
            $incomingIds = [];

            if (! empty($data['admin'])) {
                $incomingIds[] = $data['admin'];
            }
            if (! empty($data['cashiers'])) {
                $incomingIds = array_merge($incomingIds, $data['cashiers']);
            }
            if (! empty($data['operators'])) {
                $incomingIds = array_merge($incomingIds, $data['operators']);
            }

            // NOTE: Reset user lama yang posisinya digantikan
            User::where('outlet_id', $outlet->id)
                ->whereNotIn('id', $incomingIds)
                ->update([
                    'outlet_id' => null,
                    'role' => UserRole::GHOST,
                ]);

            // NOTE: Update user yang baru (jika ada)
            if (! empty($data['admin'])) {
                User::where('id', $data['admin'])->update([
                    'outlet_id' => $outlet->id,
                    'role' => UserRole::ADMIN,
                ]);
            }

            if (! empty($data['cashiers'])) {
                User::whereIn('id', $data['cashiers'])->update([
                    'outlet_id' => $outlet->id,
                    'role' => UserRole::CASHIER,
                ]);
            }

            if (! empty($data['operators'])) {
                User::whereIn('id', $data['operators'])->update([
                    'outlet_id' => $outlet->id,
                    'role' => UserRole::OPERATOR,
                ]);
            }

            return $outlet;
        });
    }
}
