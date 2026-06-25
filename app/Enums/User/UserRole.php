<?php

namespace App\Enums\User;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case CASHIER = 'cashier';
    case OPERATOR = 'operator';
    case GHOST = 'ghost';

    /**
     * Returns all role values as a plain string array.
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Returns the human-readable Indonesian label for this role.
     */
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

    /**
     * Returns selectable role options for a given role.
     * Filters based on what roles $currentRole is allowed to assign,
     * excluding SUPER_ADMIN from the result.
     */
    public static function options(UserRole $currentRole): array
    {
        $allowedRoles = self::allowedTransitions()[$currentRole->value] ?? [];

        return collect(self::cases())
            ->filter(fn (self $role) => self::isSelectableRole($role, $allowedRoles))
            ->map(fn (self $role) => self::toOption($role))
            ->values()
            ->toArray();
    }

    private static function isSelectableRole(self $role, array $allowedRoles): bool
    {
        return $role !== self::SUPER_ADMIN && \in_array($role->value, $allowedRoles, true);
    }

    private static function toOption(self $role): array
    {
        return [
            'label' => $role->indonesianLabel(),
            'value' => $role->value,
        ];
    }

    /**
     * Defines which roles a given role is permitted to assign.
     * Used for both frontend option filtering and backend validation.
     * Roles not listed here cannot assign any role.
     */
    public static function allowedTransitions(): array
    {
        return [
            self::SUPER_ADMIN->value => [self::ADMIN->value, self::CASHIER->value, self::OPERATOR->value, self::GHOST->value],
            self::ADMIN->value => [self::CASHIER->value, self::OPERATOR->value, self::GHOST->value],
        ];
    }

    /**
     * Checks whether this role is permitted to assign $newUserRole.
     * A role can always keep its current value (no-op transition).
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
