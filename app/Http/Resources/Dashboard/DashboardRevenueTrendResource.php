<?php

namespace App\Http\Resources\Dashboard;

class DashboardRevenueTrendResource
{
    /**
     * @param  array<int, array{name: string, grossRevenue: int}>  $revenueTrend
     * @param  array<int, array{date: string, loss: int}>  $lossTrend
     */
    public function __construct(
        private readonly array $revenueTrend,
        private readonly array $lossTrend,
    ) {}

    /**
     * Merge daily revenue and loss trends into a chart-ready array.
     *
     * @return array<int, array{name: string, grossRevenue: int, loss: int}>
     */
    public function toArray(): array
    {
        $lossMap = collect($this->lossTrend)->keyBy('date');

        return collect($this->revenueTrend)
            ->map(function (array $item, int $index) use ($lossMap) {
                $date = now()->startOfMonth()->addDays($index)->format('Y-m-d');

                return [
                    'name' => $item['name'],
                    'grossRevenue' => $item['grossRevenue'],
                    'loss' => data_get($lossMap, "{$date}.loss", 0),
                ];
            })->all();
    }
}
