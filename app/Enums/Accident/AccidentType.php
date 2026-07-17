<?php

namespace App\Enums\Accident;

enum AccidentType: string
{
    case LOST_ITEM = 'lost_item';
    case DAMAGED_ITEM = 'damaged_item';
    case COLOR_BLED = 'color_bled';
    case SHRUNK_ITEM = 'shrunk_item';
    case LATE_DELIVERY = 'late_delivery';
    case WRONG_DELIVERY = 'wrong_delivery';
    case OTHER = 'other';

    /**
     * Get all values
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the Indonesian label for the type
     */
    public function indonesianLabel(): string
    {
        return match ($this) {
            self::LOST_ITEM => 'Barang Hilang',
            self::DAMAGED_ITEM => 'Barang Rusak',
            self::COLOR_BLED => 'Luntur',
            self::SHRUNK_ITEM => 'Pakaian Menyusut',
            self::LATE_DELIVERY => 'Terlambat Selesai',
            self::WRONG_DELIVERY => 'Salah Antar / Tertukar',
            self::OTHER => 'Lainnya',
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
