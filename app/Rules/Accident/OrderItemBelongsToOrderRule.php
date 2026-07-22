<?php

namespace App\Rules\Accident;

use App\Models\Order\OrderItem;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\Request;

class OrderItemBelongsToOrderRule implements ValidationRule
{
    public function __construct(protected Request $request) {}

    /**
     * Validate that the given order_item_id belongs to the selected order.
     * Resolves order_id internally from the request.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        $orderId = $this->request->input('order_id');

        if (! $orderId) {
            $fail('Pesanan belum dipilih.');

            return;
        }

        $exists = OrderItem::where('id', $value)
            ->where('order_id', $orderId)
            ->exists();

        if (! $exists) {
            $fail('Item tidak ditemukan di pesanan yang dipilih.');
        }
    }
}
