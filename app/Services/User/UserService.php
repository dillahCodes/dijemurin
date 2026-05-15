<?php

namespace App\Services\User;

use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\DTOs\User\UserAddOutletFilterDTO;
use App\DTOs\User\UserFilterDTO;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Helpers\RoleHelper;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Notifications\SetPasswordNotification;
use DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserService
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

        $isSuperAdmin = RoleHelper::isRole(UserRole::SUPER_ADMIN);

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

    /**
     * Create a new user with random password and send set-password link email
     */
    public static function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $role = $data['role'] ?? null;
            $outletId = $data['outlet_id'] ?? null;
            $data['password'] = Str::random(16);

            $hasSuperAdmin = RoleHelper::isRole(UserRole::SUPER_ADMIN);
            $hasAdminSelected = RoleHelper::isRoleValueSame($role, UserRole::ADMIN->value);

            // NOTE: if admin has no outlet_id, set it to admin's outlet_id
            if (! $hasSuperAdmin) {
                $data['outlet_id'] = auth()->user()->outlet_id;
            }

            // NOTE: if new user is ADMIN and has outlet, change old ADMIN in that outlet to GHOST and remove outlet_id
            if ($hasAdminSelected && $outletId) {
                User::where('outlet_id', $outletId)
                    ->where('role', UserRole::ADMIN->value)
                    ->update(['role' => UserRole::GHOST->value, 'outlet_id' => null]);
            }

            $user = User::create($data);

            $token = Password::createToken($user);
            $user->notify(new SetPasswordNotification($token));

            return $user;
        });
    }

    /**
     * Update user
     */
    public static function updateUser(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            $role = $data['role'] ?? $user->role->value;
            $outletId = $data['outlet_id'] ?? $user->outlet_id;

            $hasSuperAdmin = RoleHelper::isRole(UserRole::SUPER_ADMIN);
            $hasAdminSelected = RoleHelper::isRoleValueSame($role, UserRole::ADMIN->value);

            // NOTE: if admin has no outlet_id, set it to admin's outlet_id
            if (! $hasSuperAdmin) {
                $data['outlet_id'] = auth()->user()->outlet_id;
                $outletId = $data['outlet_id'];
            }

            // NOTE: if updated user is ADMIN and has outlet, change old ADMIN in that outlet to GHOST and remove outlet_id
            if ($hasAdminSelected && $outletId) {
                User::where('outlet_id', $outletId)
                    ->where('role', UserRole::ADMIN->value)
                    ->where('id', '!=', $user->id)
                    ->update(['role' => UserRole::GHOST->value, 'outlet_id' => null]);
            }

            $user->update($data);
        });
    }
}
