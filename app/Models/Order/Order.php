<?php

namespace App\Models\Order;

use App\Enums\Order\OrderDateType;
use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Models\Accident\Accident;
use App\Models\Outlet\Outlet;
use App\Models\Payment\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

#[Fillable(['outlet_id', 'cashier_id', 'order_code', 'customer_name', 'total_price', 'status', 'completed_at', 'picked_up_at', 'estimated_completed_at'])]
class Order extends Model
{
    protected function casts(): array
    {
        return [
            'outlet_id' => 'integer',
            'cashier_id' => 'integer',
            'status' => OrderStatus::class,
            'total_price' => 'integer',
            'completed_at' => 'datetime',
            'picked_up_at' => 'datetime',
            'estimated_completed_at' => 'datetime',
        ];
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(OrderStatusLog::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function accidents(): HasMany
    {
        return $this->hasMany(Accident::class);
    }

    /**
     * Scope a query to search orders by customer name or order code.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function (Builder $query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%$search%")
                    ->orWhere('order_code', 'like', "%$search%");
            });
        });
    }

    /**
     * Scope a query to search orders solely by order code (lighter).
     */
    public function scopeSearchCode(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function (Builder $query) use ($search) {
            $query->where('order_code', 'like', "%{$search}%");
        });
    }

    /**
     * Scope a query to filter orders by status.
     */
    public function scopeFilterStatus(Builder $query, mixed $status): Builder
    {
        if (! $status) {
            return $query;
        }

        if (is_array($status)) {
            // Convert any OrderStatus enum instances in the array to their raw string/numeric values
            $rawStatusValues = array_map(function ($statusItem) {
                return $statusItem instanceof OrderStatus ? $statusItem->value : $statusItem;
            }, $status);

            return $query->whereIn('status', $rawStatusValues);
        }

        // Resolve status to raw value if it is an OrderStatus enum instance
        $rawStatusValue = $status instanceof OrderStatus ? $status->value : $status;

        if (is_string($rawStatusValue) && str_contains($rawStatusValue, ',')) {
            // Split the comma-separated string of status values into an array
            $splitStatuses = explode(',', $rawStatusValue);

            // Trim any surrounding whitespace from each status in the array
            $trimmedStatuses = array_map('trim', $splitStatuses);

            // Filter out any empty items from the list of statuses
            $validStatuses = array_filter($trimmedStatuses, function ($trimmedStatus) {
                return $trimmedStatus !== '';
            });

            return $query->whereIn('status', $validStatuses);
        }

        return $query->where('status', $rawStatusValue);
    }

    /**
     * Scope a query to filter orders by payment method.
     */
    public function scopePaymentMethod(Builder $query, ?PaymentMethod $paymentMethod): Builder
    {
        return $query->when($paymentMethod, function (Builder $query) use ($paymentMethod) {
            $query->whereHas('payment', function (Builder $query) use ($paymentMethod) {
                $query->where('method', $paymentMethod);
            });
        });
    }

    /**
     * Scope a query to filter orders by date range.
     */
    public function scopeFilterDateRange(Builder $query, ?string $startDate, ?string $endDate, ?OrderDateType $dateType = null): Builder
    {
        return $query->when($startDate && $endDate, function ($query) use ($startDate, $endDate, $dateType) {
            $column = match ($dateType) {
                OrderDateType::STATUS_CHANGED => 'updated_at',
                default => 'created_at',
            };

            $query->whereBetween($column, [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);
        });
    }

    /**
     * Scope a query to filter orders by outlet.
     */
    public function scopeFilterOutlet(Builder $query, ?int $outletId): Builder
    {
        return $query->when($outletId, function (Builder $query) use ($outletId) {
            $query->where('outlet_id', $outletId);
        });
    }

    /**
     * Scope a query to filter orders by outlet.
     */
    public function scopeForOutlet(Builder $query, ?int $outletId): Builder
    {
        return $query->when($outletId, function (Builder $query) use ($outletId) {
            $query->where('outlet_id', $outletId);
        });
    }

    /**
     * Scope today
     */
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereBetween('created_at', [
            now()->startOfDay(),
            now()->endOfDay(),
        ]);
    }

    /**
     * Scope today Completed
     */
    public function scopeTodayCompleted(Builder $query): Builder
    {
        return $query->whereBetween('completed_at', [
            now()->startOfDay(),
            now()->endOfDay(),
        ]);
    }

    /**
     * Scope today Picked Up
     */
    public function scopeTodayPickedUp(Builder $query): Builder
    {
        return $query->whereBetween('picked_up_at', [
            now()->startOfDay(),
            now()->endOfDay(),
        ]);
    }

    /**
     * Scope today Updated
     */
    public function scopeTodayUpdated(Builder $query): Builder
    {
        return $query->whereBetween('updated_at', [
            now()->startOfDay(),
            now()->endOfDay(),
        ]);
    }

    /**
     * Scope this week
     */
    public function scopeThisWeek(Builder $query): Builder
    {
        return $query->whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ]);
    }

    /**
     * Scope this month
     */
    public function scopeThisMonth(Builder $query): Builder
    {
        return $query->whereBetween('created_at', [
            now()->startOfMonth(),
            now()->endOfMonth(),
        ]);
    }

    /**
     * Scope this month Completed
     */
    public function scopeThisMonthCompleted(Builder $query): Builder
    {
        return $query->whereBetween('completed_at', [
            now()->startOfMonth(),
            now()->endOfMonth(),
        ]);
    }

    /**
     * Scope this month Updated
     */
    public function scopeThisMonthUpdated(Builder $query): Builder
    {
        return $query->whereBetween('updated_at', [
            now()->startOfMonth(),
            now()->endOfMonth(),
        ]);
    }

    /**
     * Scope Process
     */
    public function scopeProcess(Builder $query): Builder
    {
        return $query->where('status', OrderStatus::PROCESS->value);
    }

    /**
     * Scope Done
     */
    public function scopeDone(Builder $query): Builder
    {
        return $query->where('status', OrderStatus::DONE->value);
    }

    /**
     * Scope a query to only include overdue orders.
     */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query->whereIn('status', [OrderStatus::PENDING->value, OrderStatus::PROCESS->value])
            ->whereNotNull('estimated_completed_at')
            ->where('estimated_completed_at', '<', now());
    }

    /**
     * Scope a query to only include almost overdue orders.
     */
    public function scopeAlmostOverdue(Builder $query): Builder
    {
        $now = now();
        $threshold = $now->copy()->addMinutes(60);

        return $query->whereIn('status', [OrderStatus::PENDING->value, OrderStatus::PROCESS->value])
            ->whereNotNull('estimated_completed_at')
            ->whereBetween('estimated_completed_at', [$now, $threshold]);
    }

    /**
     * Scope Revenue Statues
     */
    public function scopeRevenueStatuses(Builder $query): Builder
    {
        return $query->whereIn('status', [
            OrderStatus::DONE->value,
            OrderStatus::PICKED_UP->value,
        ]);
    }

    /**
     * Scope Report Statues
     */
    public function scopeReportStatuses(Builder $query): Builder
    {
        return $query->whereIn('status', [
            OrderStatus::DONE->value,
            OrderStatus::PICKED_UP->value,
            OrderStatus::CANCELLED->value,
        ]);
    }

    /**
     * Scope Completed
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->whereIn('status', [
            OrderStatus::DONE->value,
            OrderStatus::PICKED_UP->value,
        ]);
    }

    /**
     * Scope Cancelled
     */
    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', OrderStatus::CANCELLED->value);
    }

    /**
     * Check if order is completed
     */
    public function isCompleted(): bool
    {
        return in_array($this->status, [
            OrderStatus::DONE,
            OrderStatus::PICKED_UP,
        ]);
    }

    /**
     * Check if order is cancelled
     */
    public function isCancelled(): bool
    {
        return $this->status === OrderStatus::CANCELLED;
    }

    /*
    * Generate order code
    */
    private function generateOrderCode(string $customerName): string
    {
        $name = User::getInitials($customerName);
        $date = now()->format('Ymd');
        $random = Str::upper(Str::random(3));

        return "ORD-{$name}-{$date}-{$random}";
    }
}
