<?php

namespace App\Models\Accident;

use App\Enums\Accident\AccidentDateType;
use App\Enums\Accident\AccidentStatus;
use App\Models\Order\Order;
use App\Models\Outlet\Outlet;
use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

#[Fillable(['outlet_id', 'order_id', 'reporter_id', 'resolver_id', 'description', 'status', 'resolved_at'])]
class Accident extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'outlet_id' => 'integer',
            'order_id' => 'integer',
            'reporter_id' => 'integer',
            'resolver_id' => 'integer',
            'status' => AccidentStatus::class,
            'resolved_at' => 'datetime',
        ];
    }

    /**
     * Scope query untuk filter berdasarkan outlet
     */
    public function scopeForOutlet(Builder $query, ?int $outletId): Builder
    {
        return $query->when($outletId, fn (Builder $queryInstance) => $queryInstance->where('outlet_id', $outletId));
    }

    /**
     * Scope query untuk insiden aktif (pending dan investigating)
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', [
            AccidentStatus::PENDING->value,
            AccidentStatus::INVESTIGATING->value,
        ]);
    }

    /**
     * Scope query untuk insiden yang telah diselesaikan (resolved)
     */
    public function scopeResolved(Builder $query): Builder
    {
        return $query->where('status', AccidentStatus::RESOLVED->value);
    }

    /**
     * Scope query untuk insiden yang diselesaikan pada bulan ini
     */
    public function scopeResolvedThisMonth(Builder $query): Builder
    {
        return $query->resolved()
            ->whereBetween('resolved_at', [
                now()->startOfMonth(),
                now()->endOfMonth(),
            ]);
    }

    /**
     * Scope query untuk filter berdasarkan pelapor (reporter)
     */
    public function scopeForReporter(Builder $query, ?int $reporterId): Builder
    {
        return $query->when($reporterId, fn (Builder $queryInstance) => $queryInstance->where('reporter_id', $reporterId));
    }

    /**
     * Scope query untuk filter berdasarkan tipe insiden (via accident_items)
     */
    public function scopeFilterType(Builder $query, string|array|null $type): Builder
    {
        if (! $type) {
            return $query;
        }

        return $query->whereHas('items', function (Builder $itemQuery) use ($type) {
            $itemQuery->filterType($type);
        });
    }

    /**
     * Scope query untuk filter berdasarkan status insiden
     */
    public function scopeFilterStatus(Builder $query, string|array|null $status): Builder
    {
        if (is_array($status)) {
            $statusValues = array_map(fn ($statusItem) => $statusItem instanceof AccidentStatus ? $statusItem->value : $statusItem, $status);

            return $query->whereIn('status', $statusValues);
        }

        return $query->when($status, function (Builder $queryInstance) use ($status) {
            $val = $status instanceof AccidentStatus ? $status->value : $status;
            $queryInstance->where('status', $val);
        });
    }

    /**
     * Scope query untuk filter berdasarkan rentang tanggal
     */
    public function scopeFilterDateRange(Builder $query, ?string $startDate, ?string $endDate, ?AccidentDateType $dateType = null): Builder
    {
        return $query->when($startDate && $endDate, function ($queryInstance) use ($startDate, $endDate, $dateType) {
            $column = match ($dateType) {
                AccidentDateType::ACCIDENT_UPDATED => 'updated_at',
                default => 'created_at',
            };

            $queryInstance->whereBetween($column, [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);
        });
    }

    /**
     * Scope query untuk pencarian berdasarkan order code dan customer name pada relasi order
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function (Builder $queryInstance) use ($search) {
            $queryInstance->whereHas('order', function ($orderQuery) use ($search) {
                $orderQuery->where('order_code', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%");
            });
        });
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolver_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(AccidentItem::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(AccidentLog::class);
    }
}
