<?php

namespace App\Enums\Accident;

enum AccidentDateType: string
{
    case ACCIDENT_CREATED = 'accident_created';
    case ACCIDENT_UPDATED = 'accident_updated';

    /**
     * Get all values
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the Indonesian label for the date type
     */
    public function indonesianLabel(): string
    {
        return match ($this) {
            self::ACCIDENT_CREATED => 'Insiden Dilaporkan',
            self::ACCIDENT_UPDATED => 'Insiden Diubah',
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
