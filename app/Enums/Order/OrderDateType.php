<?php

namespace App\Enums\Order;

enum OrderDateType: string
{
    case ORDER_CREATED = 'order_created';
    case STATUS_CHANGED = 'status_changed';

    /**
     * Get all values
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the English label for the date type
     */
    public function label(): string
    {
        return match ($this) {
            self::ORDER_CREATED => 'Order Created',
            self::STATUS_CHANGED => 'Status Changed',
        };
    }

    /**
     * Get the Indonesian label for the date type
     */
    public function indonesianLabel(): string
    {
        return match ($this) {
            self::ORDER_CREATED => 'Pesanan Dibuat',
            self::STATUS_CHANGED => 'Status Diubah',
        };
    }

    /**
     * Get all options with Indonesian labels
     */
    public static function options(): array
    {
        return collect(self::cases())->map(fn ($case) => [
            'label' => $case->indonesianLabel(),
            'value' => $case->value,
        ])->toArray();
    }
}
