<?php

namespace App\Http\Resources\Accident;

use App\Http\Resources\Outlet\OutletHeaderResource;
use App\Http\Resources\User\UserHeaderResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccidentDetailResource extends JsonResource
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
            'outlet_id' => $this->outlet_id,
            'order_id' => $this->order_id,
            'order_code' => $this->order?->order_code,
            'customer_name' => $this->order?->customer_name,
            'reporter_id' => $this->reporter_id,
            'resolver_id' => $this->resolver_id,
            'description' => $this->description,
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            // Relations
            'outlet' => OutletHeaderResource::make($this->whenLoaded('outlet')),
            'reporter' => UserHeaderResource::make($this->whenLoaded('reporter')),
            'resolver' => UserHeaderResource::make($this->whenLoaded('resolver')),
            'order' => $this->whenLoaded('order'),
            'items' => AccidentItemResource::collection($this->whenLoaded('items')),
            'logs' => AccidentLogResource::collection($this->whenLoaded('logs')),

            // Enums
            'status' => [
                'label' => $this->status->indonesianLabel(),
                'value' => $this->status->value,
            ],
        ];
    }
}
