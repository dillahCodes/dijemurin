<?php

namespace App\Http\Resources\User;

use App\Enums\User\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserTableOutletResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $users = $this->resource;

        $counts = collect(UserRole::cases())
            ->reject(fn ($role) => $role === UserRole::SUPER_ADMIN)
            ->mapWithKeys(fn ($role) => [
                $role->value => $users->where('role', $role)->count(),
            ]);

        return [
            UserRole::ADMIN->value => $counts[UserRole::ADMIN->value],
            UserRole::CASHIER->value => $counts[UserRole::CASHIER->value],
            UserRole::OPERATOR->value => $counts[UserRole::OPERATOR->value],
        ];
    }
}
