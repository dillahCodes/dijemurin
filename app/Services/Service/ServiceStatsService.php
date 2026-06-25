<?php

namespace App\Services\Service;

use App\Models\Service\Service;

class ServiceStatsService
{
    /**
     * Get active service count for a specific outlet
     */
    public static function getActiveServiceCountForOutlet(int $outletId): int
    {
        return Service::where('outlet_id', $outletId)->count();
    }
}
