<?php

namespace App\Rules\User;

use App\Enums\User\UserRole;
use App\Helpers\RoleHelper;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class OnlySuperAdminRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $hasSuperAdmin = RoleHelper::isRole(UserRole::SUPER_ADMIN);

        if (!$hasSuperAdmin) {
            $fail("Hanya Super Admin yang berhak menentukan {$attribute}.");
        }
    }
}
