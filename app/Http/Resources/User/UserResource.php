<?php

namespace App\Http\Resources\User;

use App\Http\Resources\Outlet\OutletHeaderResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
                'name',
                'email',
                'email_verified_at',
                'created_at',
                'updated_at',
            ]),

            'outlet' => OutletHeaderResource::make($this->whenLoaded('outlet')),

            'role' => [
                'label' => $this->role->indonesianLabel(),
                'value' => $this->role->value,
            ],

            'status' => [
                'label' => $this->status->indonesianLabel(),
                'value' => $this->status->value,
            ],
        ];
    }
}
