<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
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
                'total_price',
                'order_at',
                'completed_at',
            ]),

            'order_items' => $this->whenLoaded('orderItem'),
            'payment' => $this->whenLoaded('payment'),

            'status' => [
                'label' => $this->status->IndonesianLabel(),
                'value' => $this->status->value,
            ],
        ];
    }
}
