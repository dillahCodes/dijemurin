<?php

namespace App\Enums\Order;

enum OrderTimeStatus: string
{
    case ALMOST_OVERDUE = 'almost_overdue';
    case OVERDUE = 'overdue';

    /**
     * Get all values
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the Indonesian label for the status
     */
    public function indonesianLabel(): string
    {
        return match ($this) {
            self::ALMOST_OVERDUE => 'Hampir Terlambat',
            self::OVERDUE => 'Terlambat',
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
