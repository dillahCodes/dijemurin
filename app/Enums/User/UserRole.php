<?php

namespace App\Enums\User;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case CASHIER = 'cashier';
    case OPERATOR = 'operator';
    case GHOST = 'ghost';

    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function indonesianLabel(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::ADMIN => 'Admin',
            self::CASHIER => 'kasir',
            self::OPERATOR => 'Operator',
            self::GHOST => 'Belum Memiliki Role',
        };
    }

    public static function options(UserRole $currentRole): array
    {
        $allowed = self::allowedTransitions()[$currentRole->value] ?? [];

        return collect(self::cases())
            ->filter(fn ($case) => in_array($case->value, $allowed, true))
            ->map(fn ($case) => [
                'label' => $case->indonesianLabel(),
                'value' => $case->value,
            ])
            ->values()
            ->toArray();
    }

    /**
     * Define allowed transition rules for Frontend & Backend
     */
    public static function allowedTransitions(): array
    {
        return [
            self::SUPER_ADMIN->value => [
                self::SUPER_ADMIN->value,
                self::ADMIN->value,
                self::CASHIER->value,
                self::OPERATOR->value,
                self::GHOST->value,
            ],

            self::ADMIN->value => [self::CASHIER->value, self::OPERATOR->value],
        ];
    }

    /**
     * validation transition logic
     */
    public function canTransitionTo(self $newUserRole): bool
    {
        if ($this === $newUserRole) {
            return true;
        }

        $allowedTransitions = $this->allowedTransitions();

        return \in_array($newUserRole->value, $allowedTransitions[$this->value], true);
    }
}
