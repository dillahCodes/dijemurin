<?php

namespace App\Http\Resources\Report;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class ReportOrderMiddleLevelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $orders = $this->resource['orders'];
        $accidents = $this->resource['accidents'];

        // group all order data by date
        $ordersGroupByDate = $orders->filter(fn ($order) => $order->isCompleted())
            ->groupBy(fn ($order) => $order->created_at->format('Y-m-d'));

        // group all accident data by resolved date
        $accidentsGroupByDate = $accidents
            ->groupBy(fn ($accident) => Carbon::parse($accident->resolved_at)->format('Y-m-d'));

        // get all order items and group by item name
        $orderItemsGroupByItemName = $orders->filter(fn ($order) => $order->isCompleted())
            ->flatMap->orderItems->groupBy('item_name');

        // Merge all unique dates from both orders and resolved accidents
        $allDates = $ordersGroupByDate->keys()->concat($accidentsGroupByDate->keys())->unique()->sort()->values();

        $dailySummary = $allDates->map(function ($date) use ($ordersGroupByDate, $accidentsGroupByDate) {
            $dayOrders = $ordersGroupByDate->get($date, collect());
            $dayAccidents = $accidentsGroupByDate->get($date, collect());

            $grossRevenue = $dayOrders->sum('total_price');
            $accidentLoss = (int) $dayAccidents->flatMap->items->sum('compensation_amount');

            return [
                'date' => $date,
                'total_order' => $dayOrders->count(),
                'total_revenue' => $grossRevenue,
                'gross_revenue' => $grossRevenue,
                'accident_loss' => $accidentLoss,
                'net_revenue' => $grossRevenue - $accidentLoss,
            ];
        })->values();

        $statusSummary = collect(OrderStatus::cases())->mapWithKeys(fn ($statusCase) => [
            $statusCase->indonesianLabel() => $orders->where('status', $statusCase->value)->count(),
        ]);

        $paymentSummary = collect(PaymentMethod::cases())->mapWithKeys(fn ($paymentCase) => [
            $paymentCase->value => $orders->filter(fn ($order) => $order->isCompleted())
                ->where('payment.method', $paymentCase->value)
                ->sum('total_price'),
        ]);

        $serviceSummary = $orderItemsGroupByItemName->map(fn ($items, $itemName) => [
            'item_name' => $itemName,
            'unit' => $items->first()->unit,
            'total_qty' => $items->sum('quantity'),
            'total_revenue' => (int) $items->sum('subtotal'),
        ])->values();

        return [
            'daily_summary' => $dailySummary,
            'status_summary' => $statusSummary,
            'payment_summary' => $paymentSummary,
            'service_summary' => $serviceSummary,
        ];
    }
}
