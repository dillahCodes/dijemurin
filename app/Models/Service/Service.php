<?php

namespace App\Models\Service;

use App\Models\Outlet\Outlet;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'outlet_id'])]
class Service extends Model
{
    use HasFactory;

    protected function casts()
    {
        return [
            'name' => 'string',
            'description' => 'string',
            'outlet_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(ServiceItem::class);
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Scope a query to search for services with a given term.
     */
    public function scopeSearch(Builder $query, ?string $search)
    {
        return $query->when($search, function (Builder $query) use ($search) {
            $query->where('name', 'like', "%$search%")->orWhere('description', 'like', "%$search%");
        });
    }
}
