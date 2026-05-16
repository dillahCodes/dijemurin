<?php

namespace App\Rules\Service;

use App\Enums\User\UserRole;
use App\Helpers\RoleHelper;
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
        $hasSuperAdmin = RoleHelper::isRole(UserRole::SUPER_ADMIN);

        if (! $hasSuperAdmin && is_null($value)) {
            $fail('Outlet wajib diisi.');

            return;
        }

        if (! $hasSuperAdmin && ! is_null($value)) {
            $fail('Hanya Super Admin yang berhak menentukan Outlet.');
        }
    }
}
