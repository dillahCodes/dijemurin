<?php

namespace App\Rules\Accident;

use App\Enums\Accident\AccidentStatus;
use App\Models\Accident\AccidentItem;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniqueActiveAccidentItemRule implements ValidationRule
{
    /**
     * Run the validation rule.
     * Validate that the given order_item_id is not already registered in an active (non-rejected) accident.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        $exists = AccidentItem::where('order_item_id', $value)
            ->whereHas('accident', fn ($query) => $query->whereNotIn('status', [
                AccidentStatus::REJECTED->value,
                AccidentStatus::CANCELLED->value,
            ]))
            ->exists();

        if ($exists) {
            $fail('Barang ini sudah memiliki laporan insiden yang sedang aktif atau telah diselesaikan.');
        }
    }
}
