<?php

namespace App\Rules\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\User\UserRole;
use App\Models\Order\Order;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RoleCanTransitionStatusRule implements ValidationRule
{
    public function __construct(protected ?Order $order, protected UserRole $role) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $this->order) {
            return;
        }

        $newStatus = OrderStatus::from($value);
        $currentStatus = $this->order->status;

        if (! $currentStatus->canRoleTransitionTo($newStatus, $this->role)) {
            $fail("Role '{$this->role->indonesianLabel()}' tidak berhak mengubah status '{$currentStatus->indonesianLabel()}' menjadi '{$newStatus->indonesianLabel()}'.");
        }
    }
}
