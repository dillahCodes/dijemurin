<?php

namespace App\Enums\Service;

enum ServiceTimeType: string
{
    case MINUTE = 'minute';
    case HOUR = 'hour';
    case DAY = 'day';

    /**
     * Returns all time type values as a plain string array.
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Returns the human-readable Indonesian label for this time type.
     */
    public function indonesianLabel(): string
    {
        return match ($this) {
            self::MINUTE => 'menit',
            self::HOUR => 'jam',
            self::DAY => 'hari',
        };
    }

    /**
     * Returns selectable time type options.
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn (self $type) => [
                'label' => $type->indonesianLabel(),
                'value' => $type->value,
            ])
            ->values()
            ->toArray();
    }

    /**
     * Convert value of this time type to minutes without using magic numbers.
     */
    public function toMinutes(int $value): int
    {
        $minutesInHour = 60;
        $hoursInDay = 24;
        $minutesInDay = $hoursInDay * $minutesInHour;

        return match ($this) {
            self::MINUTE => $value,
            self::HOUR => $value * $minutesInHour,
            self::DAY => $value * $minutesInDay,
        };
    }
}
