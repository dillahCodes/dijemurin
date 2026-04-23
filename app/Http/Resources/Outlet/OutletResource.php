<?php

namespace App\Http\Resources\Outlet;

use App\Http\Resources\User\UserTableOutletResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OutletResource extends JsonResource
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
                'address',
                'phone',
                'email',
                'logo',
                'created_at',
                'updated_at',
            ]),

            'status' => [
                'label' => $this->status->indonesianLabel(),
                'value' => $this->status->value,
            ],

            'role_count' => UserTableOutletResource::make($this->whenLoaded('user')),
        ];
    }
}
