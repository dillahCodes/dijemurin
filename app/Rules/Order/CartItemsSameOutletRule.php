<?php

namespace App\Rules\Order;

use App\Models\Service\ServiceItem;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class CartItemsSameOutletRule implements DataAwareRule, ValidationRule
{
    protected array $data = [];

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Run the validation rule.
     *
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $cartItems = collect($this->data['cart_items'] ?? []);

        if ($cartItems->isEmpty()) {
            return;
        }

        $serviceItemIds = $cartItems->pluck('id')->filter()->values()->all();

        $outletIds = ServiceItem::distinctOutletIds($serviceItemIds)->pluck('outlet_id');

        if ($outletIds->count() > 1) {
            $fail('Semua item harus berasal dari outlet yang sama.');
        }
    }
}
