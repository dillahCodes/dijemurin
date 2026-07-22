<?php

namespace App\Rules\Service;

use App\Enums\User\UserRole;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class OnlySuperAdminRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $hasSuperAdmin = auth()->user()?->hasRole(UserRole::SUPER_ADMIN) ?? false;

        if (! $hasSuperAdmin && $value === null) {
            $fail('Outlet wajib diisi.');

            return;
        }

        if (! $hasSuperAdmin && $value !== null) {
            $fail('Hanya Super Admin yang berhak menentukan Outlet.');
        }
    }
}
