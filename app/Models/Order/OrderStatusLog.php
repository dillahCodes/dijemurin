<?php

namespace App\Models\Order;

use App\Enums\Order\OrderStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

#[Fillable(['order_id', 'user_id', 'from_status', 'to_status'])]
class OrderStatusLog extends Model
{
    /**
     * Get the attributes that should be cast.
     */
    #[Override]
    protected function casts(): array
    {
        return [
            'order_id' => 'integer',
            'user_id' => 'integer',
            'from_status' => OrderStatus::class,
            'to_status' => OrderStatus::class,
        ];
    }

    /**
     * Get the order associated with the status log.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the user who made the status change.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the logs that have the to_status equal to the given status
     */
    public function scopeToStatus(Builder $query, OrderStatus $status): Builder
    {
        return $query->where('to_status', $status);
    }

    /**
     * Get the logs that have the created_at equal to today
     */
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereBetween('created_at', [
            now()->startOfDay(),
            now()->endOfDay(),
        ]);
    }

    /**
     * Get the logs for a specific outlet
     */
    public function scopeForOutlet(Builder $query, ?int $outletId): Builder
    {
        return $query->whereHas('order', function ($query) use ($outletId) {
            $query->when($outletId, fn ($query) => $query->where('outlet_id', $outletId));
        });
    }
}
