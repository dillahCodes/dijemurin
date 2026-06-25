<?php

namespace App\Http\Resources\Report;

use App\Enums\Order\OrderStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportOrderFirstLevelResource extends JsonResource
{
    private function resolveStatus($status): string
    {
        $statusEnum = $status instanceof OrderStatus
            ? $status
            : OrderStatus::tryFrom($status);

        return $statusEnum?->indonesianLabel() ?? (string) $status;
    }

    private function mapOrderItems($orderItems)
    {
        return $orderItems->map(fn ($orderItem) => [
            'name' => $orderItem->item_name,
            'qty' => $orderItem->quantity,
            'unit' => $orderItem->unit,
            'subtotal' => $orderItem->subtotal,
        ]);
    }

    private function mapOrderPayment($payment)
    {
        return [
            'method' => $payment?->method,
            'paid' => $payment?->cash_payment_amount,
            'change' => $payment?->cash_change_amount,
        ];
    }

    private function mapOrders($orderByDate)
    {
        return $orderByDate->map(fn ($order) => [
            'customer_name' => $order->customer_name,
            'status' => $this->resolveStatus($order->status),
            'total_price' => $order->total_price,

            'order_items' => $this->mapOrderItems($order->orderItems),
            'payment' => $this->mapOrderPayment($order->payment),
        ]);
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $orders = $this->resource;

        // group all order data by date
        $ordersGroupByDate = $orders->groupBy(fn ($order) => $order->order_at->format('Y-m-d'));

        $transactions = $ordersGroupByDate->map(fn ($orderByDate, $date) => [
            'date' => $date,
            'orders' => $this->mapOrders($orderByDate),
        ])->values();

        return [
            'transactions' => $transactions,
        ];
    }
}
