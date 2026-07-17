<?php

namespace App\Rules\Accident;

use App\Enums\Accident\AccidentStatus;
use App\Enums\User\UserRole;
use App\Models\Accident\Accident;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RoleCanUpdateAccidentFieldsRule implements ValidationRule
{
    public function __construct(
        protected ?Accident $accident,
        protected User $user,
        protected string $fieldName
    ) {}

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $this->accident) {
            return;
        }

        $role = $this->user->role;
        $isNonAdmin = ! in_array($role, [UserRole::SUPER_ADMIN, UserRole::ADMIN]);

        // Mencegah tampering attack: Jika status saat ini sudah diselesaikan, ditolak, atau dibatalkan, data tidak bisa diubah lagi
        if (in_array($this->accident->status, [AccidentStatus::RESOLVED, AccidentStatus::REJECTED, AccidentStatus::CANCELLED])) {
            $fail('Insiden yang sudah diselesaikan, ditolak, atau dibatalkan tidak dapat diperbarui lagi.');

            return;
        }

        // Pengguna non-admin hanya bisa mengedit laporan milik sendiri jika status masih PENDING
        if ($isNonAdmin) {
            if ($this->accident->status !== AccidentStatus::PENDING) {
                $fail('Anda hanya dapat memperbarui data insiden saat statusnya masih Menunggu Verifikasi.');

                return;
            }

            if ($this->accident->reporter_id !== $this->user->id) {
                $fail('Anda hanya dapat memperbarui data insiden yang Anda laporkan sendiri.');

                return;
            }
        }

        // Validasi untuk resolver_id: jika terisi, nilainya harus sama dengan user yang login saat ini
        if ($this->fieldName === 'resolver_id' && $value !== null) {
            if ((int) $value !== (int) $this->user->id) {
                $fail('Kolom resolver_id harus sama dengan user yang sedang login saat ini.');

                return;
            }
        }

        // Kolom sensitif yang hanya boleh diubah oleh admin atau super_admin
        $sensitiveFields = ['status', 'resolver_id'];

        if (in_array($this->fieldName, $sensitiveFields)) {
            $originalValue = $this->accident->getAttribute($this->fieldName);

            // Handle standard Laravel enum casting to get raw value
            if (is_object($originalValue) && method_exists($originalValue, 'value')) {
                $originalValue = $originalValue->value;
            }

            $newValue = $value;
            if (is_object($newValue) && method_exists($newValue, 'value')) {
                $newValue = $newValue->value;
            }

            if ($originalValue != $newValue && $isNonAdmin) {
                $fail("Hanya Admin atau Super Admin yang dapat mengubah kolom '{$this->fieldName}'.");

                return;
            }
        }

        if ($isNonAdmin) {
            if ($this->accident->reporter_id !== $this->user->id) {
                $fail('Anda hanya dapat memperbarui data insiden yang Anda laporkan sendiri.');
            }
        }
    }
}
