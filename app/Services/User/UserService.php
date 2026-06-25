<?php

namespace App\Services\User;

use App\Enums\User\UserRole;
use App\Models\User;
use App\Notifications\SetPasswordNotification;
use DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class UserService
{
    /**
     * Create a new user with random password and send set-password link email
     */
    public static function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $role = $data['role'] ?? null;
            $outletId = $data['outlet_id'] ?? null;
            $data['password'] = Str::random(16);

            $hasSuperAdmin = auth()->user()?->hasRole(UserRole::SUPER_ADMIN) ?? false;
            $hasAdminSelected = $role === UserRole::ADMIN->value;

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

            $hasSuperAdmin = auth()->user()?->hasRole(UserRole::SUPER_ADMIN) ?? false;
            $hasAdminSelected = $role === UserRole::ADMIN->value;

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
