<?php

namespace App\Services\User;

use App\DTOs\User\UserFilterDTO;
use App\Enums\User\UserRole;
use App\Http\Resources\User\UserResource;
use App\Models\User;

class UserService
{
    /**
     * Get users data with filters
     */
    public static function getUsersData(UserFilterDTO $filter, UserRole $currentRole)
    {
        $users = User::visibleToRole($currentRole)
            ->search($filter->search)
            ->filterRole($filter->role)
            ->filterStatus($filter->status)
            ->latest()
            ->paginate($filter->limit)
            ->withQueryString();

        return UserResource::collection($users);
    }
}
