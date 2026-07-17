<?php

namespace App\Models\Order;

use App\Models\Accident\Accident;
use App\Models\Service\ServiceItem;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['order_id', 'service_item_id', 'item_name', 'item_price', 'unit', 'quantity', 'subtotal'])]
class OrderItem extends Model
{
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function serviceItem(): BelongsTo
    {
        return $this->belongsTo(ServiceItem::class);
    }

    public function accidents(): HasMany
    {
        return $this->hasMany(Accident::class);
    }

    protected function casts(): array
    {
        return [
            'item_price' => 'integer',
            'quantity' => 'float',
            'subtotal' => 'integer',
        ];
    }
}
