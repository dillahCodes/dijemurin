<?php

namespace App\Services\Outlet;

use App\Enums\Outlet\OutletStatus;
use App\Models\Outlet\Outlet;

class OutletStatsService
{
    /**
     * Get active outlet count
     */
    public static function getActiveOutletCount(): int
    {
        return Outlet::status(OutletStatus::ACTIVE)->count();
    }
}
