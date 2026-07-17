<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemComboboxResource extends JsonResource
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
            'item_name' => $this->item_name,
            'quantity' => $this->quantity,
            'unit' => $this->unit,
            'label' => "{$this->item_name} ({$this->quantity} {$this->unit})",
        ];
    }
}
