<?php

namespace App\Rules\Outlet;

use App\Enums\Outlet\OutletStatus;
use App\Models\Outlet\Outlet;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class OutletIsActive implements ValidationRule
{
    public function __construct(
        private readonly ?int $outletId = null,
    ) {}

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $outletId = $this->outletId ?? $value;

        $exists = Outlet::where('id', $outletId)->where('status', OutletStatus::ACTIVE->value)->exists();

        if (! $exists) {
            $fail('Outlet yang dipilih tidak valid atau nonaktif');
        }

    }
}
