<?php

namespace App\Rules\Outlet;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class OutletUserIsUnassigned implements ValidationRule
{
    /**
     * Create a new rule instance.
     *
     * @param int|null $ignoreOutletId The ID of the outlet to ignore during validation.
     */
    public function __construct(protected ?int $ignoreOutletId = null)
    {
    }

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::find($value);

        if (! $user) {
            return;
        }

        if ($user->outlet_id && $user->outlet_id !== $this->ignoreOutletId) {
            $fail('Pengguna telah memiliki outlet');
        }
    }
}
