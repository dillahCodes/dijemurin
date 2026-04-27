<?php

namespace App\Helpers;

use App\Enums\User\UserRole;

class RoleHelper
{
    /**
     * Check if the currently authenticated user has the specified role.
     */
    public static function isRole(UserRole $role): bool
    {
        $user = auth()->user();

        return $user && $user->role === $role;
    }
}
