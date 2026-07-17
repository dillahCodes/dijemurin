<?php

namespace App\Rules\Accident;

use App\Enums\Order\OrderStatus;
use App\Models\Order\Order;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AllowedOrderStatusForAccidentRule implements ValidationRule
{
    /**
     * Run the validation rule.
     * Validate that the order has one of the allowed statuses (process, done, picked up).
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        $order = Order::find($value);

        if (! $order) {
            return;
        }

        $allowedStatuses = [
            OrderStatus::PROCESS,
            OrderStatus::DONE,
            OrderStatus::PICKED_UP,
        ];

        if (! in_array($order->status, $allowedStatuses, true)) {
            $fail('Laporan insiden hanya dapat dibuat untuk pesanan dengan status Diproses, Selesai, atau Diambil.');
        }
    }
}
