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

    public function indonesianLabel(): string
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
            'label' => $case->indonesianLabel(),
            'value' => $case->value,
        ])->toArray();
    }

    /**
     * Define allowed transition rules for Frontend & Backend
     */
    public static function allowedTransitions(): array
    {
        return [
            self::PENDING->value => [self::PROCESS->value, self::CANCELLED->value],
            self::PROCESS->value => [self::DONE->value],
            self::DONE->value => [self::PICKED_UP->value],
            self::PICKED_UP->value => [],
            self::CANCELLED->value => [],
        ];
    }

    /**
     * validation transition logic
     */
    public function canTransitionTo(self $newStatus): bool
    {
        if ($this === $newStatus) {
            return true;
        }

        $allowedTransitions = $this->allowedTransitions();

        return \in_array($newStatus->value, $allowedTransitions[$this->value], true);
    }
}
