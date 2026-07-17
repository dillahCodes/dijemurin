<?php

namespace App\Http\Resources\Accident;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccidentItemResource extends JsonResource
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
            'accident_id' => $this->accident_id,
            'order_item_id' => $this->order_item_id,
            'order_item_name' => $this->orderItem?->item_name,
            'item_details' => $this->item_details,
            'description' => $this->description,
            'compensation_amount' => $this->compensation_amount,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            'type' => [
                'label' => $this->type->indonesianLabel(),
                'value' => $this->type->value,
            ],
            'compensation_type' => $this->compensation_type ? [
                'label' => $this->compensation_type->indonesianLabel(),
                'value' => $this->compensation_type->value,
            ] : null,
        ];
    }
}
