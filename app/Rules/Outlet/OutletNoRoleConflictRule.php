<?php

namespace App\Rules\Outlet;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class OutletNoRoleConflictRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $admin = request()->input('admin');
        $cashiers = is_array(request()->input('cashiers')) ? request()->input('cashiers') : [];
        $operators = is_array(request()->input('operators')) ? request()->input('operators') : [];

        $all = array_filter([...[$admin], ...$cashiers, ...$operators]);
        $counts = array_count_values($all);

        $duplicates = array_keys(array_filter($counts, fn ($count) => $count > 1));

        if (empty($duplicates)) {
            return;
        }

        $valueArray = is_array($value) ? $value : [$value];
        $intersect = array_intersect($valueArray, $duplicates);

        if (! empty($intersect)) {
            $fail('Satu user hanya boleh memiliki satu role di dalam outlet.');
        }
    }
}
