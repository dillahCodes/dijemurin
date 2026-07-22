<?php

namespace App\Services\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Models\Order\Order;
use App\Models\Order\OrderStatusLog;

class OrderStatsService
{
    /**
     * Get today's non-cancelled order count
     */
    public static function getTodayOrderCount(): int
    {
        return Order::today()->whereNot('status', OrderStatus::CANCELLED->value)->count();
    }

    /**
     * Get process order count
     */
    public static function getProcessOrderCount(): int
    {
        return Order::where('status', OrderStatus::PROCESS->value)->count();
    }

    /**
     * Get done order count
     */
    public static function getDoneOrderCount(): int
    {
        return Order::where('status', OrderStatus::DONE->value)->count();
    }

    public static function getTodayRevenue(): int
    {
        return Order::todayCompleted()->revenueStatuses()->sum('total_price');
    }

    /**
     * Get Week Revenue for chart
     */
    public static function getChartWeekRevenue(): array
    {
        $orders = Order::thisWeek()->revenueStatuses()->get(['created_at', 'total_price']);

        $days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

        $grouped = $orders->groupBy(fn ($order) => $order->created_at->format('Y-m-d'));

        return collect($days)->map(function ($day, $index) use ($grouped) {
            $date = now()->startOfWeek()->addDays($index)->format('Y-m-d');
            $sumRevenueThisDay = $grouped->get($date)?->sum('total_price') ?? 0;

            return ['name' => $day, 'total' => $sumRevenueThisDay];
        })->values()->toArray();
    }

    /**
     * Get Month Statuses for chart
     */
    public static function getChartMonthStatuses(): array
    {
        $orders = Order::thisMonth()->get(['status']);
        $englishStatuses = OrderStatus::toArray();

        return collect($englishStatuses)->map(function ($status) use ($orders) {
            $count = $orders->where('status', $status)->count();
            $enum = OrderStatus::from($status);

            $labelValue = ['name' => $enum->indonesianLabel(), 'value' => $enum->value];

            return ['label' => $labelValue, 'value' => $count];
        })->toArray();
    }

    /**
     * Get all-time revenue across all outlets
     */
    public static function getAllTimeRevenue(): int
    {
        return Order::revenueStatuses()->sum('total_price');
    }

    /**
     * Get all-time non-cancelled order count across all outlets
     */
    public static function getAllTimeOrderCount(): int
    {
        return Order::whereNot('status', OrderStatus::CANCELLED->value)->count();
    }

    public static function getTodayRevenueForOutlet(int $outletId): int
    {
        return Order::todayCompleted()->forOutlet($outletId)->revenueStatuses()->sum('total_price');
    }

    /**
     * Get today's non-cancelled order count for a specific outlet
     */
    public static function getTodayOrderCountForOutlet(int $outletId): int
    {
        return Order::today()->forOutlet($outletId)->whereNot('status', OrderStatus::CANCELLED->value)->count();
    }

    /**
     * Get pending order count for a specific outlet
     */
    public static function getPendingOrderCountForOutlet(int $outletId): int
    {
        return Order::forOutlet($outletId)->where('status', OrderStatus::PENDING->value)->count();
    }

    /**
     * Get processing order count for a specific outlet
     */
    public static function getProcessOrderCountForOutlet(int $outletId): int
    {
        return Order::forOutlet($outletId)->where('status', OrderStatus::PROCESS->value)->count();
    }

    /**
     * Get today's revenue by payment method for a specific outlet
     */
    public static function getTodayRevenueByPaymentMethodForOutlet(int $outletId, PaymentMethod $method): int
    {
        return Order::todayCompleted()->forOutlet($outletId)->revenueStatuses()->paymentMethod($method)->sum('total_price');
    }

    public static function getCompletedTodayCountForOutlet(int $outletId): int
    {
        return Order::forOutlet($outletId)->todayCompleted()->count();
    }

    /**
     * Get overdue order count for a specific outlet
     */
    public static function getOverdueCountForOutlet(int $outletId): int
    {
        return Order::forOutlet($outletId)->overdue()->count();
    }

    public static function getThisMonthRevenue(): int
    {
        return Order::thisMonthCompleted()->revenueStatuses()->sum('total_price');
    }

    /**
     * Get this month's non-cancelled order count across all outlets
     */
    public static function getThisMonthOrderCount(): int
    {
        return Order::thisMonth()->whereNot('status', OrderStatus::CANCELLED->value)->count();
    }

    /**
     * Get this month's revenue for a specific outlet
     */
    public static function getThisMonthRevenueForOutlet(int $outletId): int
    {
        return Order::thisMonth()->forOutlet($outletId)->revenueStatuses()->sum('total_price');
    }

    /**
     * Get done order count for a specific outlet
     */
    public static function getDoneOrderCountForOutlet(int $outletId): int
    {
        return Order::done()->forOutlet($outletId)->count();
    }

    /**
     * Get today's transaction count for a specific outlet
     */
    public static function getTodayTransactionCountForOutlet(int $outletId): int
    {
        return Order::today()->revenueStatuses()->forOutlet($outletId)->count();
    }

    public static function getPickedUpTodayCountForOutlet(int $outletId): int
    {
        return Order::forOutlet($outletId)->todayPickedUp()->count();
    }

    /**
     * Get overdue order count across all outlets
     */
    public static function getOverdueCount(): int
    {
        return Order::overdue()->count();
    }

    /**
     * Get almost overdue order count across all outlets
     */
    public static function getAlmostOverdueCount(): int
    {
        return Order::almostOverdue()->count();
    }

    public static function getCancelledTodayCount(): int
    {
        return Order::todayUpdated()->where('status', OrderStatus::CANCELLED->value)->count();
    }

    /**
     * Get this month's cancelled order count across all outlets
     */
    public static function getCancelledThisMonthCount(): int
    {
        return Order::thisMonthUpdated()->where('status', OrderStatus::CANCELLED->value)->count();
    }

    /**
     * Get today's cancelled order count for a specific outlet
     */
    public static function getCancelledTodayCountForOutlet(int $outletId): int
    {
        return Order::forOutlet($outletId)->todayUpdated()->where('status', OrderStatus::CANCELLED->value)->count();
    }

    public static function getAlmostOverdueCountForOutlet(int $outletId): int
    {
        return Order::forOutlet($outletId)->almostOverdue()->count();
    }

    /**
     * Get this month's daily revenue trend for chart (all outlets).
     *
     * @return array<int, array{name: string, total: int}>
     */
    public static function getChartMonthRevenueTrend(): array
    {
        $orders = Order::thisMonthCompleted()->revenueStatuses()->get(['completed_at', 'total_price']);

        $grouped = $orders->groupBy(fn ($order) => $order->completed_at->format('Y-m-d'));

        $daysInMonth = now()->daysInMonth;

        return collect(range(1, $daysInMonth))->map(function ($day) use ($grouped) {
            $date = now()->startOfMonth()->addDays($day - 1);
            $dateKey = $date->format('Y-m-d');
            $sumRevenueThisDay = $grouped->get($dateKey)?->sum('total_price') ?? 0;

            return ['name' => $date->format('j M'), 'grossRevenue' => $sumRevenueThisDay];
        })->values()->toArray();
    }

    /**
     * Get this month's order count by status for chart (all outlets).
     *
     * @return array<int, array{label: array{name: string, value: string}, value: int}>
     */
    public static function getChartMonthOrderStatuses(): array
    {
        $orders = Order::thisMonth()->get(['status']);
        $englishStatuses = OrderStatus::toArray();

        return collect($englishStatuses)->map(function ($status) use ($orders) {
            $count = $orders->where('status', $status)->count();
            $enum = OrderStatus::from($status);

            $labelValue = ['name' => $enum->indonesianLabel(), 'value' => $enum->value];

            return ['label' => $labelValue, 'value' => $count];
        })->toArray();
    }

    /**
     * Get this month's daily revenue trend for chart for a specific outlet.
     *
     * @return array<int, array{name: string, total: int}>
     */
    public static function getChartMonthRevenueTrendForOutlet(int $outletId): array
    {
        $orders = Order::thisMonthCompleted()->forOutlet($outletId)->revenueStatuses()->get(['completed_at', 'total_price']);

        $grouped = $orders->groupBy(fn ($order) => $order->completed_at->format('Y-m-d'));

        $daysInMonth = now()->daysInMonth;

        return collect(range(1, $daysInMonth))->map(function ($day) use ($grouped) {
            $date = now()->startOfMonth()->addDays($day - 1);
            $dateKey = $date->format('Y-m-d');
            $sumRevenueThisDay = $grouped->get($dateKey)?->sum('total_price') ?? 0;

            return ['name' => $date->format('j M'), 'grossRevenue' => (int) $sumRevenueThisDay];
        })->values()->toArray();
    }

    /**
     * Get this month's daily order incoming vs completed count for chart for a specific outlet.
     *
     * @return array<int, array{name: string, order_masuk: int, order_selesai: int}>
     */
    public static function getChartMonthOrderMovementForOutlet(int $outletId): array
    {
        $incomingOrders = Order::thisMonth()->forOutlet($outletId)->whereNot('status', OrderStatus::CANCELLED->value)->get(['created_at']);
        $completedOrders = Order::thisMonthCompleted()->forOutlet($outletId)->revenueStatuses()->get(['completed_at']);

        $groupedIncoming = $incomingOrders->groupBy(fn ($order) => $order->created_at->format('Y-m-d'));
        $groupedCompleted = $completedOrders->groupBy(fn ($order) => $order->completed_at->format('Y-m-d'));

        $daysInMonth = now()->daysInMonth;

        return collect(range(1, $daysInMonth))->map(function ($day) use ($groupedIncoming, $groupedCompleted) {
            $date = now()->startOfMonth()->addDays($day - 1);
            $dateKey = $date->format('Y-m-d');

            $incomingCount = $groupedIncoming->get($dateKey)?->count() ?? 0;
            $completedCount = $groupedCompleted->get($dateKey)?->count() ?? 0;

            return [
                'name' => $date->format('j M'),
                'order_masuk' => $incomingCount,
                'order_selesai' => $completedCount,
            ];
        })->values()->toArray();
    }

    /**
     * Get today's hourly incoming order count for a specific outlet.
     *
     * @return array<int, array{hour: string, count: int}>
     */
    public static function getTodayHourlyOrderCountForOutlet(int $outletId): array
    {
        $orders = Order::today()
            ->forOutlet($outletId)
            ->whereNot('status', OrderStatus::CANCELLED->value)
            ->get(['created_at']);

        $grouped = $orders->groupBy(fn ($order) => $order->created_at->format('H'));

        return collect(range(0, 23))->map(function ($hour) use ($grouped) {
            $hourStr = str_pad((string) $hour, 2, '0', STR_PAD_LEFT);
            $count = $grouped->get($hourStr)?->count() ?? 0;

            return [
                'hour' => $hourStr.':00',
                'count' => (int) $count,
            ];
        })->values()->toArray();
    }

    /**
     * Get today's completed orders count grouped by payment method for a specific outlet.
     *
     * @return array<int, array{label: array{name: string, value: string}, value: int}>
     */
    public static function getTodayPaymentMethodChartDataForOutlet(int $outletId): array
    {
        $orders = Order::todayCompleted()
            ->forOutlet($outletId)
            ->revenueStatuses()
            ->with('payment')
            ->get();

        $cashCount = $orders->filter(fn ($order) => $order->payment?->method === PaymentMethod::CASH)->count();
        $qrisCount = $orders->filter(fn ($order) => $order->payment?->method === PaymentMethod::QRIS)->count();

        return [
            [
                'label' => ['name' => 'Cash', 'value' => 'cash'],
                'value' => (int) $cashCount,
            ],
            [
                'label' => ['name' => 'QRIS', 'value' => 'qris'],
                'value' => (int) $qrisCount,
            ],
        ];
    }

    /**
     * Get today's hourly processed vs completed orders count for a specific outlet.
     *
     * @return array<int, array{hour: string, diproses: int, selesai: int}>
     */
    public static function getTodayHourlyProcessedVsCompletedForOutlet(int $outletId): array
    {
        $processedLogs = OrderStatusLog::today()
            ->forOutlet($outletId)
            ->toStatus(OrderStatus::PROCESS)
            ->get(['created_at']);

        $completedOrders = Order::todayCompleted()
            ->forOutlet($outletId)
            ->get(['completed_at']);

        $groupedProcessed = $processedLogs->groupBy(fn ($log) => $log->created_at->format('H'));
        $groupedCompleted = $completedOrders->groupBy(fn ($order) => $order->completed_at->format('H'));

        return collect(range(0, 23))->map(function ($hour) use ($groupedProcessed, $groupedCompleted) {
            $hourStr = str_pad((string) $hour, 2, '0', STR_PAD_LEFT);
            $processedCount = $groupedProcessed->get($hourStr)?->count() ?? 0;
            $completedCount = $groupedCompleted->get($hourStr)?->count() ?? 0;

            return [
                'hour' => $hourStr.':00',
                'diproses' => (int) $processedCount,
                'selesai' => (int) $completedCount,
            ];
        })->values()->toArray();
    }
}
