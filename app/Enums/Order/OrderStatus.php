<?php

namespace App\Enums\Order;

use App\Enums\User\UserRole;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PROCESS = 'process';
    case DONE = 'done';
    case PICKED_UP = 'picked up';
    case CANCELLED = 'cancelled';

    /**
     * Get all order status
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the Indonesian label for the status
     */
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

    /**
     * Get all order status options with Indonesian labels
     */
    public static function options(): array
    {
        return collect(self::cases())->map(fn ($case) => [
            'label' => $case->indonesianLabel(),
            'value' => $case->value,
        ])->toArray();
    }

    /**
     * Sequential transition rules (internal source of truth)
     */
    private static function allowedTransitions(): array
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
     * Base role permissions (ignoring sequential constraints)
     */
    private static function roleStatusPermissions(): array
    {
        return [
            UserRole::SUPER_ADMIN->value => [self::PROCESS->value, self::DONE->value, self::PICKED_UP->value, self::CANCELLED->value],
            UserRole::ADMIN->value => [self::PROCESS->value, self::DONE->value, self::PICKED_UP->value, self::CANCELLED->value],
            UserRole::CASHIER->value => [self::CANCELLED->value, self::PICKED_UP->value],
            UserRole::OPERATOR->value => [self::PROCESS->value, self::DONE->value],
        ];
    }

    /**
     * Combined role + sequential transition rules.
     * Returns: role → current_status → [valid_next_statuses]
     *
     * SUPER_ADMIN & ADMIN : all sequential transitions
     * CASHIER             : can set cancelled, picked_up (if sequentially valid)
     * OPERATOR            : can set process, done (if sequentially valid)
     */
    public static function allowedRoleTransitions(): array
    {
        $roleTransitions = [];

        foreach (self::roleStatusPermissions() as $role => $allowedStatuses) {
            $roleTransitions[$role] = self::buildTransitionsForRole($allowedStatuses);
        }

        return $roleTransitions;
    }

    private static function buildTransitionsForRole(array $allowedStatuses): array
    {
        $transitions = [];

        foreach (self::allowedTransitions() as $currentStatus => $targetStatuses) {
            $transitions[$currentStatus] = self::onlyAllowedStatuses(
                targetStatuses: $targetStatuses,
                allowedStatuses: $allowedStatuses,
            );
        }

        return $transitions;
    }

    private static function onlyAllowedStatuses(array $targetStatuses, array $allowedStatuses): array
    {
        return array_values(array_filter(
            $targetStatuses,
            fn (string $status) => \in_array($status, $allowedStatuses, true),
        ));
    }

    /**
     * Check if the given role is authorized to transition to $newStatus.
     * Enforces both role permission and sequential order.
     */
    public function canRoleTransitionTo(self $newStatus, UserRole $role): bool
    {
        if ($this === $newStatus) {
            return true;
        }

        $allowed = self::allowedRoleTransitions()[$role->value][$this->value] ?? [];

        return \in_array($newStatus->value, $allowed, true);
    }

    /**
     * check if given status can transition to $newStatus
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
