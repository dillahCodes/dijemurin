<?php

namespace App\Models\Accident;

use App\Enums\Accident\AccidentCompensationType;
use App\Enums\Accident\AccidentType;
use App\Models\Order\OrderItem;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'accident_id',
    'order_item_id',
    'type',
    'item_details',
    'description',
    'compensation_type',
    'compensation_amount',
])]
class AccidentItem extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'accident_id' => 'integer',
            'order_item_id' => 'integer',
            'type' => AccidentType::class,
            'compensation_type' => AccidentCompensationType::class,
            'compensation_amount' => 'integer',
        ];
    }

    /**
     * Scope query to filter accident items by type.
     */
    public function scopeFilterType(Builder $query, string|array|null $type): Builder
    {
        if (is_array($type)) {
            $typeValues = array_map(
                fn ($typeItem) => $typeItem instanceof AccidentType ? $typeItem->value : $typeItem,
                $type
            );

            return $query->whereIn('type', $typeValues);
        }

        $value = $type instanceof AccidentType ? $type->value : $type;

        return $query->where('type', $value);
    }

    /**
     * Scope query to filter accident items by outlet through the related accident.
     */
    public function scopeForOutlet(Builder $query, ?int $outletId): Builder
    {
        return $query->when($outletId, function ($queryInstance) use ($outletId) {
            return $queryInstance->whereHas('accident', function ($q) use ($outletId) {
                $q->forOutlet($outletId);
            });
        });
    }

    /**
     * Scope query for accident items whose related accident was resolved this month.
     */
    public function scopeResolvedThisMonth(Builder $query): Builder
    {
        return $query->whereHas('accident', function ($q) {
            $q->resolvedThisMonth();
        });
    }

    /**
     * Scope query for accident items whose related accident was resolved this month
     * and belongs to the specified outlet.
     */
    public function scopeResolvedThisMonthLoss(Builder $query, ?int $outletId): Builder
    {
        return $query->whereHas('accident', function ($q) use ($outletId) {
            $q->resolvedThisMonth()->forOutlet($outletId);
        });
    }

    /**
     * Scope query for accident items whose related accident was resolved this month
     * and belongs to the specified outlet, including the accident's resolved date.
     * Used for grouping loss data by resolved date in charts.
     */
    public function scopeResolvedThisMonthLossWithDate(Builder $query, ?int $outletId): Builder
    {
        return $query
            ->resolvedThisMonthLoss($outletId)
            ->with('accident:id,resolved_at');
    }

    public function accident(): BelongsTo
    {
        return $this->belongsTo(Accident::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }
}
