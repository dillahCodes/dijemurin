<?php

namespace App\Enums\Accident;

enum AccidentCompensationType: string
{
    case NONE = 'none';
    case REFUND = 'refund';
    case REPLACEMENT = 'replacement';
    case FREE_SERVICE = 'free_service';
    case REPAIR = 'repair';

    /**
     * Get all values
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the Indonesian label for the compensation type
     */
    public function indonesianLabel(): string
    {
        return match ($this) {
            self::NONE => 'Tidak Ada',
            self::REFUND => 'Pengembalian Uang',
            self::REPLACEMENT => 'Ganti Barang Baru',
            self::FREE_SERVICE => 'Layanan Gratis',
            self::REPAIR => 'Perbaikan Barang',
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
