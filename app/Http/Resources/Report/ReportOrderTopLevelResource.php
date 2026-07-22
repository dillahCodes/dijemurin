<?php

namespace App\Http\Resources\Report;

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
        $orders = $this->resource['orders'];
        $accidents = $this->resource['accidents'];

        $totalOrder = $orders->count();
        $completed = $orders->filter(fn ($order) => $order->isCompleted())->count();
        $cancelled = $orders->filter(fn ($order) => $order->isCancelled())->count();

        $total_revenue = $orders->filter(fn ($order) => $order->isCompleted())
            ->sum('total_price');

        $accident_loss = (int) $accidents->flatMap->items->sum('compensation_amount');
        $gross_revenue = $total_revenue;
        $net_revenue = $gross_revenue - $accident_loss;

        $paymentSummary = collect(PaymentMethod::cases())->mapWithKeys(fn ($paymentCase) => [
            $paymentCase->value => $orders->filter(fn ($order) => $order->isCompleted())
                ->where('payment.method', $paymentCase->value)
                ->sum('total_price'),
        ]);

        $orderItems = $orders->filter(fn ($order) => $order->isCompleted())
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
            'gross_revenue' => $gross_revenue,
            'accident_loss' => $accident_loss,
            'net_revenue' => $net_revenue,
            'payment_summary' => $paymentSummary,
            'top_services' => $topServiceItems,
        ];
    }
}
