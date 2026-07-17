<?php

namespace App\Rules\Accident;

use App\Enums\Accident\AccidentStatus;
use App\Models\Accident\Accident;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidAccidentStatusTransition implements ValidationRule
{
    public function __construct(protected ?Accident $accident) {}

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $this->accident) {
            return;
        }

        $newStatus = AccidentStatus::tryFrom($value);
        if (! $newStatus) {
            return;
        }

        $currentStatus = $this->accident->status;

        if (! ($currentStatus instanceof AccidentStatus)) {
            $currentStatus = AccidentStatus::from($currentStatus);
        }

        if (! $currentStatus->canTransitionTo($newStatus)) {
            $fail("Laporan insiden dengan status '{$currentStatus->indonesianLabel()}' tidak bisa diubah menjadi '{$newStatus->indonesianLabel()}'.");
        }
    }
}
