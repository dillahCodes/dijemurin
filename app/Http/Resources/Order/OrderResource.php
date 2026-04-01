<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->only([
                'id',
                'order_code',
                'customer_name',
                'status',
                'total_price',
                'order_at',
                'created_at',
                'updated_at',
            ]),
            'payment_method' => $this->payment?->method,
        ];
    }
}
