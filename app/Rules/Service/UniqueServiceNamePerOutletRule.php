<?php

namespace App\Rules\Service;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Support\Facades\DB;
use Illuminate\Translation\PotentiallyTranslatedString;
use Illuminate\Validation\Validator;

class UniqueServiceNamePerOutletRule implements ValidationRule, ValidatorAwareRule
{
    protected Validator $validator;

    public function __construct(
        protected ?int $outletId,
        protected ?int $ignoreServiceId = null
    ) {}

    public function setValidator(Validator $validator): static
    {
        $this->validator = $validator;

        return $this;
    }

    /**
     * Run the validation rule.
     *
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! isset($this->outletId)) {
            // Inject the error directly onto outlet_id, not on the name field
            $this->validator->errors()->add('outlet_id', 'Outlet wajib diisi');

            return;
        }

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
