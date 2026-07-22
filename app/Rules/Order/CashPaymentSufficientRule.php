<?php

namespace App\Rules\Order;

use App\Enums\Payment\PaymentMethod;
use App\Models\Service\ServiceItem;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class CashPaymentSufficientRule implements DataAwareRule, ValidationRule
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
        $paymentMethod = $this->data['payment_method'] ?? null;

        // IF QRIS RETURN
        if ($paymentMethod !== PaymentMethod::CASH->value) {
            return;
        }

        // CART ITEMS
        $cartItems = collect($this->data['cart_items'] ?? []);

        // IF EMPTY RETURN
        if ($cartItems->isEmpty()) {
            return;
        }

        // GET SERVICE ITEM BASED ON CART
        $serviceItems = ServiceItem::whereIn('id', $cartItems->pluck('id'))
            ->get(['id', 'price'])
            ->keyBy('id');

        // SUM TOTAL PRICE
        $totalPrice = $cartItems->sum(function ($item) use ($serviceItems) {
            $serviceItem = $serviceItems->get($item['id']);

            return $serviceItem ? $serviceItem->price * $item['qty'] : 0;
        });

        // IF CASH PAYMENT LESS THAN TOTAL PRICE
        if ((int) $value < $totalPrice) {
            $fail('Jumlah bayar tunai (cash) kurang dari total tagihan.');
        }
    }
}
