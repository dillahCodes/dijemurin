<?php

namespace App\Http\Resources\Report;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportOrderMiddleLevelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $orders = $this->resource;

        // group all order data by date
        $ordersGroupByDate = $orders->whereIn('status', [OrderStatus::DONE, OrderStatus::PICKED_UP])
            ->groupBy(fn ($order) => $order->order_at->format('Y-m-d'));

        // get all order items and group by item name
        $orderItemsGroupByItemName = $orders->whereIn('status', [OrderStatus::DONE, OrderStatus::PICKED_UP])
            ->flatMap->orderItem->groupBy('item_name');

        $dailySummary = $ordersGroupByDate->map(fn ($items, $date) => [
            'date' => $date,
            'total_order' => $items->count(),
            'total_revenue' => $items->sum('total_price'),
        ])->values();

        $statusSummary = collect(OrderStatus::cases())->mapWithKeys(fn ($statusCase) => [
            $statusCase->indonesianLabel() => $orders->where('status', $statusCase->value)->count(),
        ]);

        $paymentSummary = collect(PaymentMethod::cases())->mapWithKeys(fn ($paymentCase) => [
            $paymentCase->value => $orders->whereIn('status', [OrderStatus::DONE, OrderStatus::PICKED_UP])
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
