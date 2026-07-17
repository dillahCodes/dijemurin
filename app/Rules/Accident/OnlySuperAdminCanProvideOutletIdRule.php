<?php

namespace App\Rules\Accident;

use App\Enums\User\UserRole;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class OnlySuperAdminCanProvideOutletIdRule implements ValidationRule
{
    public function __construct(protected User $user) {}

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->user->hasAnyRole([UserRole::SUPER_ADMIN])) {
            if ($value === null || $value === '') {
                $fail('Outlet wajib dipilih oleh Super Admin.');
            }

            return;
        }

        if ($value !== null && $value !== '') {
            $fail('Hanya Super Admin yang diizinkan untuk menentukan outlet.');
        }
    }
}
