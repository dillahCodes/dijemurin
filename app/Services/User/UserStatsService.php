<?php

namespace App\Services\User;

use App\Enums\User\UserStatus;
use App\Models\User;

class UserStatsService
{
    /**
     * Get active user count
     */
    public static function getActiveUserCount(): int
    {
        return User::filterStatus(UserStatus::ACTIVE)->filterNotSuperAdmin()->count();
    }

    /**
     * Get employee count for specific outlet
     */
    public static function getEmployeeCountForOutlet(int $outletId): int
    {
        return User::where('outlet_id', $outletId)->count();
    }
}
