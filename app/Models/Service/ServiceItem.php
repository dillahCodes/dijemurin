<?php

namespace App\Models\Service;

use App\Enums\Service\ServiceTimeType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['name', 'description', 'time_number', 'time_type', 'price', 'unit', 'service_id'])]
class ServiceItem extends Model
{
    use HasFactory;

    protected function casts()
    {
        return [
            'name' => 'string',
            'description' => 'string',
            'time_number' => 'integer',
            'time_type' => ServiceTimeType::class,
            'price' => 'integer',
            'unit' => 'string',
            'service_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Scope a query to search for service items with a given term.
     */
    public function scopeSearch(Builder $query, ?string $search)
    {
        return $query->when($search, function (Builder $query) use ($search) {
            $query->where('name', 'like', "%$search%")->orWhere('description', 'like', "%$search%");
        });
    }

    /**
     * Scope to get distinct outlet IDs from the given item IDs.
     * Useful for validating that all items in an order belong to the same outlet.
     *
     * Usage:
     *   $outletIds = ServiceItem::distinctOutletIds($itemIds)->pluck('outlet_id');
     *   if ($outletIds->count() > 1) { ... }
     */
    public function scopeDistinctOutletIds(Builder $query, array $serviceItemIds): Builder
    {
        return $query
            ->join('services', 'service_items.service_id', '=', 'services.id')
            ->whereIn('service_items.id', $serviceItemIds)
            ->select('services.outlet_id')
            ->distinct();
    }
}
