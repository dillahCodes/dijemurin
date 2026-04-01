<?php

namespace App\Models\Payment;

use App\Enums\Payment\PaymentMethod;
use App\Models\Order\Order;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Guarded(['id'])]
class Payment extends Model
{
    public function order(): HasOne
    {
        return $this->hasOne(Order::class);
    }

    protected function casts(): array
    {
        return [
            'method' => PaymentMethod::class,
            'cash_payment_amount' => 'integer',
            'cash_change_amount' => 'integer',
        ];
    }
}
