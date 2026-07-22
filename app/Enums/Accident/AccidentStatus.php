<?php

namespace App\Enums\Accident;

use App\Enums\User\UserRole;

enum AccidentStatus: string
{
    case PENDING = 'pending';
    case INVESTIGATING = 'investigating';
    case RESOLVED = 'resolved';
    case REJECTED = 'rejected';
    case CANCELLED = 'cancelled';

    /**
     * Get all values
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
            self::PENDING => 'Menunggu Verifikasi',
            self::INVESTIGATING => 'Dalam Penyelidikan',
            self::RESOLVED => 'Selesai',
            self::REJECTED => 'Ditolak',
            self::CANCELLED => 'Dibatalkan',
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

    /**
     * Allowed status transitions
     */
    private static function allowedTransitions(): array
    {
        return [
            self::PENDING->value => [self::INVESTIGATING->value],
            self::INVESTIGATING->value => [self::RESOLVED->value, self::REJECTED->value, self::CANCELLED->value],
            self::RESOLVED->value => [],
            self::REJECTED->value => [],
            self::CANCELLED->value => [],
        ];
    }

    /**
     * Base role permissions (ignoring sequential constraints)
     */
    private static function roleStatusPermissions(): array
    {
        return [
            UserRole::SUPER_ADMIN->value => [self::PENDING->value, self::INVESTIGATING->value, self::RESOLVED->value, self::REJECTED->value, self::CANCELLED->value],
            UserRole::ADMIN->value => [self::PENDING->value, self::INVESTIGATING->value, self::RESOLVED->value, self::REJECTED->value, self::CANCELLED->value],
            UserRole::CASHIER->value => [],
            UserRole::OPERATOR->value => [],
        ];
    }

    /**
     * Combined role + sequential transition rules.
     * Returns: role → current_status → [valid_next_statuses]
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
     * Check if status can transition to the new status
     */
    public function canTransitionTo(self $newStatus): bool
    {
        if ($this === $newStatus) {
            return true;
        }

        $allowed = self::allowedTransitions();

        return in_array($newStatus->value, $allowed[$this->value], true);
    }
}
