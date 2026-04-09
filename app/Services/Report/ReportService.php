<?php

namespace App\Services\Report;

use App\DTOs\Report\ReportFilterDTO;
use App\Models\Order\Order;

class ReportService
{
    public static function getReportsData(ReportFilterDTO $filter)
    {
        $hasDateRange = ! $filter->hasDateRange();

        if ($hasDateRange) {
            return collect();
        }

        return Order::filterDateRange($filter->startDate, $filter->endDate)->reportStatuses()->with(['orderItem', 'payment'])->get();
    }
}
