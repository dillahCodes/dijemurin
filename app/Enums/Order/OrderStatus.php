<?php

namespace App\Enums\Order;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PROCESS = 'process';
    case DONE = 'done';
    case PICKED_UP = 'picked up';
    case CANCELLED = 'cancelled';

    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function IndonesianLabel(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu',
            self::PROCESS => 'Diproses',
            self::DONE => 'Selesai',
            self::PICKED_UP => 'Diambil',
            self::CANCELLED => 'Dibatalkan',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())->map(fn ($case) => [
            'label' => $case->IndonesianLabel(),
            'value' => $case->value,
        ])->toArray();
    }
}
