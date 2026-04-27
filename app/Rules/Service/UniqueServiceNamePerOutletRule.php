<?php

namespace App\Rules\Service;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;
use Illuminate\Translation\PotentiallyTranslatedString;

class UniqueServiceNamePerOutletRule implements ValidationRule
{
    public function __construct(
        protected int $outletId,
        protected ?int $ignoreServiceId = null
    ) {}

    /**
     * Run the validation rule.
     *
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = DB::table('services')
            ->where('name', $value)
            ->where('outlet_id', $this->outletId);

        if ($this->ignoreServiceId) {
            $query->where('id', '!=', $this->ignoreServiceId);
        }

        if ($query->exists()) {
            $fail('Nama layanan sudah ada');
        }
    }
}
