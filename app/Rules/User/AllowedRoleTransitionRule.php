<?php

namespace App\Rules\User;

use App\Enums\User\UserRole;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class AllowedRoleTransitionRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = request()->user();
        $hasSuperAdmin = $user?->hasRole(UserRole::SUPER_ADMIN) ?? false;
        $hasSuperAdminSelected = $value === UserRole::SUPER_ADMIN->value;

        if ($hasSuperAdminSelected) {
            $fail('Anda tidak memiliki izin untuk memberikan role Super Admin.');

            return;
        }

        if ($hasSuperAdmin && $hasSuperAdminSelected) {
            $fail('Role tidak valid atau Anda tidak memiliki izin untuk memberikan role tersebut.');

            return;
        }

        $allowedRoles = UserRole::allowedTransitions()[$user->role->value] ?? [];

        if (! \in_array($value, $allowedRoles, true)) {
            $fail('Role tidak valid atau Anda tidak memiliki izin untuk memberikan role tersebut.');
        }
    }
}
