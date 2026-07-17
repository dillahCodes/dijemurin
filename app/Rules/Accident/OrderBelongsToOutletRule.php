<?php

namespace App\Rules\Accident;

use App\Enums\User\UserRole;
use App\Models\Order\Order;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class OrderBelongsToOutletRule implements ValidationRule
{
    public function __construct(protected User $user) {}

    /**
     * Validate that the given order_id belongs to the resolved outlet.
     * Resolves outlet_id internally based on the user's role.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        // Super Admin: outlet_id comes from the request body (already validated by OnlySuperAdminCanProvideOutletIdRule).
        // Other roles: outlet_id is locked to the authenticated user's outlet.
        $outletId = $this->user->hasRole(UserRole::SUPER_ADMIN)
            ? request()->input('outlet_id')
            : $this->user->outlet_id;

        if (! $outletId) {
            $fail('Outlet belum dipilih.');

            return;
        }

        $exists = Order::where('id', $value)
            ->where('outlet_id', $outletId)
            ->exists();

        if (! $exists) {
            $fail('Pesanan tidak ditemukan di outlet yang dipilih.');
        }
    }
}
