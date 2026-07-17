<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderComboboxResource extends JsonResource
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
            'order_code' => $this->order_code,
            'customer_name' => $this->customer_name,
            'label' => "{$this->order_code} - {$this->customer_name} - {$this->status->indonesianLabel()}",
            'status' => ['label' => $this->status->indonesianLabel(), 'value' => $this->status->value],
        ];
    }
}
