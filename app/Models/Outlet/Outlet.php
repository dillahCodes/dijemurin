<?php

namespace App\Models\Outlet;

use App\Enums\Outlet\OutletStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'address', 'phone', 'email', 'logo', 'status'])]
class Outlet extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => OutletStatus::class,
        ];
    }

    public function user(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Scope a query to search for services with a given term.
     */
    public function scopeSearch(Builder $query, ?string $search)
    {
        return $query->when($search, function (Builder $query) use ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('address', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
                ->orWhere('phone', 'like', "%$search%");
        });
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeStatus(Builder $query, ?OutletStatus $status)
    {
        return $query->when($status, function (Builder $query) use ($status) {
            $query->where('status', $status);
        });
    }
}
