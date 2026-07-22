<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\Outlet\OutletHeaderResource;
use App\Http\Resources\User\UserHeaderResource;
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
            ...$this->only(['id', 'order_code', 'customer_name', 'total_price']),
            'estimated_completed_at' => $this->estimated_completed_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'outlet' => OutletHeaderResource::make($this->whenLoaded('outlet')),
            'cashier' => UserHeaderResource::make($this->whenLoaded('cashier')),
            'order_items' => $this->whenLoaded('orderItems'),
            'payment' => $this->whenLoaded('payment'),
            'status_logs' => OrderStatusLogResource::collection($this->whenLoaded('statusLogs')),
            'status' => [
                'label' => $this->status->indonesianLabel(),
                'value' => $this->status->value,
            ],
        ];
    }
}
