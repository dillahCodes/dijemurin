<?php

namespace App\Http\Resources\Outlet;

use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OutletDetailResource extends JsonResource
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
                'created_at',
                'updated_at',
            ]),
            'picture' => $this->picture ? asset('storage/'.$this->picture) : null,

            'status' => [
                'label' => $this->status->indonesianLabel(),
                'value' => $this->status->value,
            ],

            'users' => UserResource::collection($this->whenLoaded('user')),
        ];
    }
}
