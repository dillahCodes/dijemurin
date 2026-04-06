<?php

namespace App\Models\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Helpers\StringHelper;
use App\Models\Payment\Payment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

#[Fillable(['order_code', 'customer_name', 'total_price', 'status', 'completed_at'])]
class Order extends Model
{
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'total_price' => 'integer',
            'order_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function orderItem(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
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
     * Scope a query to filter orders by status.
     */
    public function scopeFilterStatus(Builder $query, ?OrderStatus $status): Builder
    {
        return $query->when($status, function (Builder $query) use ($status) {
            $query->where('status', $status);
        });
    }

    /**
     * Scope a query to filter orders by payment method.
     */
    public function scopeFilterPaymentMethod(Builder $query, ?PaymentMethod $paymentMethod): Builder
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
    public function scopeFilterDateRange(Builder $query, ?string $startDate, ?string $endDate): Builder
    {
        return $query->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
            $query->whereBetween('order_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);
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
     * Scope Done
     */
    public function scopeDone(Builder $query): Builder
    {
        return $query->where('status', OrderStatus::DONE->value);
    }

    /**
     * Scope Process
     */
    public function scopeProcess(Builder $query): Builder
    {
        return $query->where('status', OrderStatus::PROCESS->value);
    }

    /**
     * Scope Revenue Statues
     */
    public function scopeRevenueStatuses($query)
    {
        return $query->whereIn('status', [
            OrderStatus::DONE->value,
            OrderStatus::PICKED_UP->value,
        ]);
    }

    /*
    * Generate order code
    */
    private function generateOrderCode(string $customerName): string
    {
        $name = StringHelper::getInitials($customerName);
        $date = now()->format('Ymd');
        $random = Str::upper(Str::random(3));

        return "ORD-{$name}-{$date}-{$random}";
    }
}
