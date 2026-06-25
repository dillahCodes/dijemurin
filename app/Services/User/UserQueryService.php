<?php

namespace App\Services\User;

use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\DTOs\User\UserAddOutletFilterDTO;
use App\DTOs\User\UserFilterDTO;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class UserQueryService
{
    /**
     * Get users index data with filters
     */
    public static function getUsersDataIndex(UserFilterDTO $filter, ?OutletComboboxFilterDTO $outletFilter)
    {
        $currentUser = auth()->user();

        $query = User::with('outlet')
            ->visibleToRole($currentUser->role)
            ->filterNotSuperAdmin()
            ->search($filter->search)
            ->filterRole($filter->role)
            ->filterStatus($filter->status)
            ->latest();

        $isSuperAdmin = $currentUser?->hasRole(UserRole::SUPER_ADMIN) ?? false;

        // NOTE: non super admin → force outlet filter
        if (! $isSuperAdmin) {
            if ($currentUser->outlet_id) {
                $query->filterOutlet($currentUser->outlet_id);
            }

            return UserResource::collection($query->paginate($filter->limit)->withQueryString());
        }

        // NOTE: super admin flow
        if ($outletFilter?->outletIdSelected) {
            $query->filterOutlet($outletFilter->outletIdSelected);
        }

        return UserResource::collection($query->paginate($filter->limit)->withQueryString());
    }

    /**
     * Get users data for add outlet
     */
    public static function getAssignableOutletUsers(UserAddOutletFilterDTO $filter)
    {
        $users = User::search($filter->search)
            ->filterGhostRole()
            ->filterNoOutlet()
            ->filterStatus(UserStatus::ACTIVE)
            ->latest()
            ->paginate($filter->limit)
            ->withQueryString();

        return UserResource::collection($users);
    }

    public static function getUserById(?int $id): UserResource
    {
        if (! $id) {
            throw ValidationException::withMessages([
                'user_id' => 'User ID is required',
            ]);
        }

        $user = User::with('outlet')->findOrFail($id);

        return UserResource::make($user);
    }
}
