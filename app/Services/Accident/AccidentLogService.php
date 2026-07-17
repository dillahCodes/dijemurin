<?php

namespace App\Services\Accident;

use App\Models\Accident\Accident;
use App\Models\Accident\AccidentItem;
use App\Models\Accident\AccidentLog;

class AccidentLogService
{
    /**
     * Catat log baru menggunakan JS-object-like parameter.
     *
     * @param array{
     *     accident: Accident,
     *     item?: AccidentItem|null,
     *     field: string,
     *     old_value: mixed,
     *     new_value: mixed,
     *     user_id?: int|null
     * } $data
     */
    public static function log(array $data): AccidentLog
    {
        $oldValue = $data['old_value'];
        if ($oldValue instanceof \BackedEnum) {
            $oldValue = $oldValue->value;
        }

        $newValue = $data['new_value'];
        if ($newValue instanceof \BackedEnum) {
            $newValue = $newValue->value;
        }

        return AccidentLog::create([
            'accident_id' => $data['accident']->id,
            'user_id' => $data['user_id'] ?? auth()->id(),
            'accident_item_id' => $data['item']?->id ?? null,
            'field_name' => $data['field'],
            'old_value' => is_null($oldValue) ? null : (string) $oldValue,
            'new_value' => is_null($newValue) ? null : (string) $newValue,
        ]);
    }
}
