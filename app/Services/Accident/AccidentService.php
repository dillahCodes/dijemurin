<?php

namespace App\Services\Accident;

use App\Enums\Accident\AccidentStatus;
use App\Enums\User\UserRole;
use App\Models\Accident\Accident;
use BackedEnum;
use Illuminate\Support\Facades\DB;

class AccidentService
{
    /**
     * Create a new accident (header) along with its items (detail).
     *
     * @param  array{
     *     outlet_id: int,
     *     order_id: int,
     *     description: string|null,
     *     items: array<int, array{
     *         order_item_id: int,
     *         type: string,
     *         item_details: string|null,
     *         description: string
     *     }>
     * }  $data
     */
    public static function createAccident(array $data): Accident
    {
        return DB::transaction(function () use ($data) {
            $user = auth()->user();

            // Hanya super_admin yang boleh custom outlet_id, selainnya menggunakan outlet milik user login
            $outletId = $user->hasAnyRole([UserRole::SUPER_ADMIN]) ? $data['outlet_id'] : $user->outlet_id;

            // Buat header accident
            $accident = Accident::create([
                'outlet_id' => $outletId,
                'order_id' => $data['order_id'],
                'reporter_id' => $user->id,
                'resolver_id' => null,
                'description' => $data['description'] ?? null,
                'status' => AccidentStatus::PENDING,
            ]);

            // Buat detail accident_items
            $itemsData = collect($data['items'])->map(fn (array $item) => [
                'accident_id' => $accident->id,
                'order_item_id' => $item['order_item_id'],
                'type' => $item['type'],
                'item_details' => $item['item_details'] ?? null,
                'description' => $item['description'],
                'compensation_type' => null,
                'compensation_amount' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray();

            $accident->items()->insert($itemsData);

            // Log status awal PENDING
            AccidentLogService::log([
                'accident' => $accident,
                'field' => 'status',
                'old_value' => null,
                'new_value' => AccidentStatus::PENDING->value,
                'user_id' => $user->id,
            ]);

            return $accident;
        });
    }

    /**
     * Update an existing accident record.
     */
    public static function updateAccident(array $data, Accident $accident): Accident
    {
        return DB::transaction(function () use ($data, $accident) {
            $userId = auth()->id();

            self::updateAccidentItems($data, $accident, $userId);
            self::updateAccidentHeader($data, $accident, $userId);

            return $accident;
        });
    }

    /**
     * Menangani pembaruan dan logging item detail.
     */
    private static function updateAccidentItems(array $data, Accident $accident, int $userId): void
    {
        if (! isset($data['items'])) {
            return;
        }

        foreach ($data['items'] as $itemData) {
            $accidentItem = $accident->items()->findOrFail($itemData['id']);

            $updatePayload = [
                'type' => $itemData['type'],
                'item_details' => $itemData['item_details'] ?? null,
                'description' => $itemData['description'],
            ];

            if (array_key_exists('compensation_type', $itemData)) {
                $updatePayload['compensation_type'] = $itemData['compensation_type'];
            }

            if (array_key_exists('compensation_amount', $itemData)) {
                $updatePayload['compensation_amount'] = $itemData['compensation_amount'];
            }

            $accidentItem->fill($updatePayload);
            $dirty = $accidentItem->getDirty();

            if (empty($dirty)) {
                continue;
            }

            $original = $accidentItem->getOriginal();
            foreach ($dirty as $field => $newValue) {
                $oldValue = $original[$field] ?? null;

                if (self::isEquivalent($oldValue, $newValue)) {
                    continue;
                }

                AccidentLogService::log([
                    'accident' => $accident,
                    'item' => $accidentItem,
                    'field' => $field,
                    'old_value' => $oldValue,
                    'new_value' => $newValue,
                    'user_id' => $userId,
                ]);
            }

            $accidentItem->save();
        }
    }

    /**
     * Menangani pembaruan dan logging header utama insiden.
     */
    private static function updateAccidentHeader(array $data, Accident $accident, int $userId): void
    {
        $currentStatus = $accident->status;
        $accidentPayload = collect($data)->except('items')->toArray();

        if (isset($data['status'])) {
            $newStatus = AccidentStatus::from($data['status']);
            self::prepareCompletionData($accidentPayload, $newStatus);
        }

        $accident->fill($accidentPayload);
        $dirty = $accident->getDirty();

        // Pengecualian status dari general field logging
        unset($dirty['status']);

        // Log transisi status secara khusus
        if (isset($data['status'])) {
            $newStatus = AccidentStatus::from($data['status']);
            if ($currentStatus !== $newStatus) {
                AccidentLogService::log([
                    'accident' => $accident,
                    'field' => 'status',
                    'old_value' => $currentStatus->value,
                    'new_value' => $newStatus->value,
                    'user_id' => $userId,
                ]);
            }
        }

        if (empty($dirty)) {
            $accident->save();

            return;
        }

        $original = $accident->getOriginal();
        foreach ($dirty as $field => $newValue) {
            $oldValue = $original[$field] ?? null;

            if (self::isEquivalent($oldValue, $newValue)) {
                continue;
            }

            AccidentLogService::log([
                'accident' => $accident,
                'item' => null,
                'field' => $field,
                'old_value' => $oldValue,
                'new_value' => $newValue,
                'user_id' => $userId,
            ]);
        }

        $accident->save();
    }

    private static function prepareCompletionData(array &$data, AccidentStatus $status): void
    {
        $completedStatuses = [AccidentStatus::RESOLVED, AccidentStatus::REJECTED, AccidentStatus::CANCELLED];

        // jika bukan resolved atau rejected, maka null resolved_at
        if (! in_array($status, $completedStatuses, true)) {
            $data['resolved_at'] = null;

            return;
        }

        $data['resolved_at'] = now();

        // jika sudah resolved atau rejected maka otomatis resolver_id adalah auth()->id()
        if (! isset($data['resolver_id'])) {
            $data['resolver_id'] = auth()->id();
        }
    }

    /**
     * Cek apakah nilai lama dan nilai baru setara secara semantik.
     */
    private static function isEquivalent(mixed $oldValue, mixed $newValue): bool
    {
        if ($oldValue === $newValue) {
            return true;
        }

        $normOld = self::normalizeValue($oldValue);
        $normNew = self::normalizeValue($newValue);

        return $normOld === $normNew;
    }

    /**
     * Normalisasikan nilai kosong (null, empty string, 0, 'none') menjadi null.
     */
    private static function normalizeValue(mixed $value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        if ($value instanceof BackedEnum) {
            $value = $value->value;
        }

        $str = trim((string) $value);

        $equivalents = ['', '0', 'none'];

        return \in_array($str, $equivalents, true) ? null : $str;
    }
}
