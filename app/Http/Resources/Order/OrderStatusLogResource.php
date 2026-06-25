<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\User\UserHeaderResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderStatusLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'user' => UserHeaderResource::make($this->whenLoaded('user')),
            'from_status' => $this->from_status ? [
                'label' => $this->from_status->indonesianLabel(),
                'value' => $this->from_status->value,
            ] : null,
            'to_status' => [
                'label' => $this->to_status->indonesianLabel(),
                'value' => $this->to_status->value,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
