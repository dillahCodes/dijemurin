<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\Outlet\Outlet;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'status', 'outlet_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
        ];
    }

    /**
     * Get the outlet that the user belongs to.
     */
    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Scope a query to search user by name or email.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function (Builder $query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        });
    }

    /**
     * Scope a query to filter user by role.
     */
    public function scopeFilterRole(Builder $query, ?UserRole $role): Builder
    {
        return $query->when($role, function (Builder $query) use ($role) {
            $query->where('role', $role);
        });
    }

    /**
     * Scope a query to filter user by status.
     */
    public function scopeFilterStatus(Builder $query, ?UserStatus $status): Builder
    {
        return $query->when($status, function (Builder $query) use ($status) {
            $query->where('status', $status);
        });
    }

    /**
     * Scope a query to only show users with roles visible to the given role.
     */
    public function scopeVisibleToRole(Builder $query, UserRole $currentRole): Builder
    {
        $allowedRoles = UserRole::allowedTransitions()[$currentRole->value] ?? [];

        return $query->whereIn('role', $allowedRoles);
    }
}
