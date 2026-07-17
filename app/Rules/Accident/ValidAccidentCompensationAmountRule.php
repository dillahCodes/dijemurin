<?php

namespace App\Rules\Accident;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidAccidentCompensationAmountRule implements ValidationRule
{
    /**
     * Run the validation rule.
     * Validate that the compensation amount matches the selected compensation type.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (preg_match('/items\.(\d+)\.compensation_amount/', $attribute, $matches)) {
            $index = (int) $matches[1];
            $type = request()->input("items.{$index}.compensation_type");

            if (in_array($type, ['refund', 'replacement', 'free_service', 'repair'])) {
                if ($value < 1) {
                    $fail('Estimasi kerugian harus minimal Rp 1.');
                }
            } else {
                if ($value !== 0) {
                    $fail('Estimasi kerugian tidak boleh diisi jika jenis kompensasi adalah "Tidak Ada".');
                }
            }
        }
    }
}
