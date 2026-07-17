<?php

namespace App\Services\Accident;

use App\Models\Accident\Accident;
use App\Models\Accident\AccidentItem;
use Illuminate\Support\Carbon;

class AccidentStatsService
{
    /**
     * Get the number of active accidents.
     */
    public static function getActiveAccidentCount(?int $outletId = null): int
    {
        return Accident::forOutlet($outletId)
            ->active()
            ->count();
    }

    /**
     * Get the number of accidents resolved this month.
     */
    public static function getResolvedThisMonthCount(?int $outletId = null): int
    {
        return Accident::forOutlet($outletId)
            ->resolvedThisMonth()
            ->count();
    }

    /**
     * Get the total compensation loss from accidents resolved this month.
     */
    public static function getResolvedThisMonthLoss(?int $outletId = null): int
    {
        return AccidentItem::resolvedThisMonthLoss($outletId)
            ->sum('compensation_amount');
    }

    /**
     * Get the number of accidents reported by the specified user.
     */
    public static function getReportedAccidentCount(int $userId): int
    {
        return Accident::forReporter($userId)
            ->count();
    }

    /**
     * Get the daily loss trend for the current month.
     *
     * @return array<int, array{date: string, loss: int}>
     */
    public static function getChartMonthLossTrend(?int $outletId = null): array
    {
        $items = AccidentItem::resolvedThisMonthLossWithDate($outletId)->get();

        $grouped = $items->groupBy(
            fn ($item) => Carbon::parse($item->accident->resolved_at)->format('Y-m-d')
        );

        $daysInMonth = now()->daysInMonth;

        return collect(range(1, $daysInMonth))
            ->map(function ($day) use ($grouped) {
                $date = now()->startOfMonth()->addDays($day - 1);
                $dateKey = $date->format('Y-m-d');
                $totalLoss = $grouped->get($dateKey)?->sum('compensation_amount') ?? 0;

                return [
                    'date' => $dateKey,
                    'loss' => (int) $totalLoss,
                ];
            })
            ->values()
            ->toArray();
    }
}
