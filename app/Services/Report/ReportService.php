<?php

namespace App\Services\Report;

use App\DTOs\Report\ReportFilterDTO;
use App\Enums\Accident\AccidentDateType;
use App\Enums\User\UserRole;
use App\Models\Accident\Accident;
use App\Models\Order\Order;

class ReportService
{
    public static function getReportsData(ReportFilterDTO $filter)
    {
        $hasDateRange = ! $filter->hasDateRange();

        if ($hasDateRange) {
            return [
                'orders' => collect(),
                'accidents' => collect(),
            ];
        }

        $user = request()->user();
        $outletId = ($user && $user->role !== UserRole::SUPER_ADMIN) ? $user->outlet_id : null;

        $orders = Order::filterDateRange($filter->startDate, $filter->endDate)
            ->forOutlet($outletId)
            ->with(['orderItems', 'payment'])
            ->get();

        $accidents = Accident::resolved()
            ->filterDateRange($filter->startDate, $filter->endDate, AccidentDateType::ACCIDENT_RESOLVED)
            ->forOutlet($outletId)
            ->with('items')
            ->get();

        return [
            'orders' => $orders,
            'accidents' => $accidents,
        ];
    }
}
