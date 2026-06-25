<?php

namespace App\Http\Resources\Report;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportOrderTopLevelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $orders = $this->resource;

        $totalOrder = $orders->count();
        $completed = $orders->whereIn('status', [OrderStatus::DONE, OrderStatus::PICKED_UP])->count();
        $cancelled = $orders->where('status', OrderStatus::CANCELLED)->count();

        $total_revenue = $orders->whereIn('status', [OrderStatus::DONE, OrderStatus::PICKED_UP])
            ->sum('total_price');

        $paymentSummary = collect(PaymentMethod::cases())->mapWithKeys(fn ($paymentCase) => [
            $paymentCase->value => $orders->whereIn('status', [OrderStatus::DONE, OrderStatus::PICKED_UP])
                ->where('payment.method', $paymentCase->value)
                ->sum('total_price'),
        ]);

        $orderItems = $orders->whereIn('status', [OrderStatus::DONE, OrderStatus::PICKED_UP])
            ->flatMap->orderItems
            ->groupBy('item_name');

        $orderItemsMaped = $orderItems->map(fn ($item) => [
            'item_name' => $item->first()->item_name,
            'total_qty' => $item->sum('quantity'),
            'unit' => $item->first()->unit,
        ]);

        $topServiceItems = $orderItemsMaped->sortByDesc('total_qty')->take(5)->values();

        return [
            'summary' => [
                'total_order' => $totalOrder,
                'completed' => $completed,
                'cancelled' => $cancelled,
            ],
            'total_revenue' => $total_revenue,
            'payment_summary' => $paymentSummary,
            'top_services' => $topServiceItems,
        ];
    }
}
