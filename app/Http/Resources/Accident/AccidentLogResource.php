<?php

namespace App\Http\Resources\Accident;

use App\Enums\Accident\AccidentStatus;
use App\Http\Resources\User\UserHeaderResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccidentLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'accident_id' => $this->accident_id,
            'user' => UserHeaderResource::make($this->whenLoaded('user')),
            'field_name' => $this->field_name,
            'created_at' => $this->created_at?->toIso8601String(),
        ];

        return array_merge($data, match ($this->field_name) {
            'status' => [
                'from_status' => $this->old_value ? [
                    'label' => AccidentStatus::tryFrom($this->old_value)?->indonesianLabel() ?? $this->old_value,
                    'value' => $this->old_value,
                ] : null,
                'to_status' => [
                    'label' => AccidentStatus::tryFrom($this->new_value)?->indonesianLabel() ?? $this->new_value,
                    'value' => $this->new_value,
                ],
            ],
            default => [
                'old_value' => $this->old_value,
                'new_value' => $this->new_value,
                'item' => $this->accident_item_id ? [
                    'id' => $this->accident_item_id,
                    'name' => $this->accidentItem?->orderItem?->item_name,
                ] : null,
            ],
        });
    }
}
