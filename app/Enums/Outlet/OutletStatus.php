<?php

namespace App\Enums\Outlet;

enum OutletStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';

    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function indonesianLabel(): string
    {
        return match ($this) {
            self::ACTIVE => 'Aktif',
            self::INACTIVE => 'Tidak Aktif',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())->map(fn ($case) => [
            'label' => $case->indonesianLabel(),
            'value' => $case->value,
        ])->toArray();
    }
}
