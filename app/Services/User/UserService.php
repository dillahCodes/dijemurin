<?php

namespace App\Services\User;

use App\DTOs\User\UserAddOutletFilterDTO;
use App\DTOs\User\UserFilterDTO;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserService
{
    /**
     * Get users data with filters
     */
    public static function getUsersData(UserFilterDTO $filter, UserRole $currentRole)
    {
        $users = User::with('outlet')
            ->visibleToRole($currentRole)
            ->search($filter->search)
            ->filterRole($filter->role)
            ->filterStatus($filter->status)
            ->latest()
            ->paginate($filter->limit)
            ->withQueryString();

        return UserResource::collection($users);
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
     * Create a new user with random password and send reset link email
     */
    public static function createUser(array $data): User
    {
        $data['password'] = Str::random(16);

        $user = User::create($data);

        Password::broker()->sendResetLink(['email' => $user->email]);

        return $user;
    }

    /**
     * Update user
     */
    public static function updateUser(User $user, array $data)
    {
       return DB::transaction(function () use ($user, $data) {
           $hasEmailChanged = $user->email !== $data['email'];
           $user->update($data);

           if ($hasEmailChanged) {
               Password::broker()->sendResetLink(['email' => $user->email]);
           }
       });
    }
}
