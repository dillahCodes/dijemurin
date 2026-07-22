<?php

namespace App\Services\Order;

use App\Enums\Order\OrderStatus;
use App\Models\Order\Order;
use App\Models\Order\OrderStatusLog;

class OrderStatusLogService
{
    /**
     * Log an order status change transition.
     */
    public static function log(Order $order, ?OrderStatus $fromStatus, OrderStatus $toStatus, ?int $userId = null): OrderStatusLog
    {
        return OrderStatusLog::create([
            'order_id' => $order->id,
            'user_id' => $userId ?? auth()->id(),
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
        ]);
    }
}
