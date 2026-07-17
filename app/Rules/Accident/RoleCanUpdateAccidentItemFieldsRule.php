<?php

namespace App\Rules\Accident;

use App\Enums\User\UserRole;
use App\Models\Accident\AccidentItem;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RoleCanUpdateAccidentItemFieldsRule implements ValidationRule
{
    public function __construct(
        protected User $user
    ) {}

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $role = $this->user->role;
        $isNonAdmin = ! in_array($role, [UserRole::SUPER_ADMIN, UserRole::ADMIN]);

        if (preg_match('/items\.(\d+)\.(.+)/', $attribute, $matches)) {
            $index = (int) $matches[1];
            $fieldName = $matches[2];

            $itemId = request()->input("items.{$index}.id");
            if (! $itemId) {
                return;
            }

            $accidentItem = AccidentItem::find($itemId);
            if (! $accidentItem) {
                return;
            }

            $originalValue = $accidentItem->getAttribute($fieldName);
            if (is_object($originalValue) && method_exists($originalValue, 'value')) {
                $originalValue = $originalValue->value;
            }

            $newValue = $value;
            if (is_object($newValue) && method_exists($newValue, 'value')) {
                $newValue = $newValue->value;
            }

            if ($originalValue != $newValue && $isNonAdmin) {
                $fail("Hanya Admin atau Super Admin yang dapat mengubah kolom '{$fieldName}' pada item.");
            }
        }
    }
}
