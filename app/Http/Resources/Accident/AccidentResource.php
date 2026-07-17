<?php

namespace App\Http\Resources\Accident;

use App\Enums\User\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccidentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isSuperAdmin = auth()->user()?->hasAnyRole([UserRole::SUPER_ADMIN]) ?? false;

        return [
            'id' => $this->id,
            'outlet_id' => $this->when($isSuperAdmin, $this->outlet_id),
            'outlet_name' => $this->when($isSuperAdmin, $this->outlet?->name),
            'order_id' => $this->order_id,
            'order_code' => $this->order?->order_code,
            'customer_name' => $this->order?->customer_name,
            'reporter_id' => $this->reporter_id,
            'reporter_name' => $this->reporter?->name,
            'resolver_id' => $this->resolver_id,
            'resolver_name' => $this->resolver?->name,
            'description' => $this->description,
            'items_count' => $this->items_count ?? 0,
            'total_compensation_amount' => (int) ($this->items_sum_compensation_amount ?? 0),
            'resolved_at' => $this->resolved_at ? $this->resolved_at->format('Y-m-d H:i:s') : null,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,

            'status' => [
                'label' => $this->status->indonesianLabel(),
                'value' => $this->status->value,
            ],
            'logs' => AccidentLogResource::collection($this->whenLoaded('logs')),
        ];
    }
}
