<?php

namespace App\Rules\Order;

use App\Enums\Order\OrderStatus;
use App\Models\Order\Order;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidStatusTransition implements ValidationRule
{
    public function __construct(protected ?Order $order) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $this->order) {
            return;
        }

        $newStatus = OrderStatus::from($value);
        $currentStatus = $this->order->status;

        if (! $currentStatus->canTransitionTo($newStatus)) {
            $fail("Pesanan dengan status '{$currentStatus->indonesianLabel()}' tidak bisa diubah menjadi '{$newStatus->indonesianLabel()}'.");
        }
    }
}
