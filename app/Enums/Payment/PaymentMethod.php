<?php

namespace App\Enums\Payment;

enum PaymentMethod: string
{
    case CASH = 'cash';
    case QRIS = 'qris';

    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function options(): array
    {
        return collect(self::cases())->map(fn ($case) => [
            'label' => ucfirst(strtolower($case->name)),
            'value' => $case->value,
        ])->toArray();
    }
}
