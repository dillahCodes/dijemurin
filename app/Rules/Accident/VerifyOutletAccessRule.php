<?php

namespace App\Rules\Accident;

use App\Enums\User\UserRole;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class VerifyOutletAccessRule implements ValidationRule
{
    public function __construct(protected User $user) {}

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->user->hasRole(UserRole::SUPER_ADMIN)) {
            return;
        }

        if ((int) $value !== (int) $this->user->outlet_id) {
            $fail('Outlet yang dipilih tidak sesuai dengan outlet Anda.');
        }
    }
}
