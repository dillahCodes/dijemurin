<?php

namespace App\Models\Accident;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

#[Fillable(['accident_id', 'user_id', 'accident_item_id', 'field_name', 'old_value', 'new_value'])]
class AccidentLog extends Model
{
    /**
     * Get the attributes that should be cast.
     */
    #[Override]
    protected function casts(): array
    {
        return [
            'accident_id' => 'integer',
            'user_id' => 'integer',
            'accident_item_id' => 'integer',
        ];
    }

    /**
     * Get the accident associated with the log.
     */
    public function accident(): BelongsTo
    {
        return $this->belongsTo(Accident::class);
    }

    /**
     * Get the user who made the change.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the accident item associated with the log.
     */
    public function accidentItem(): BelongsTo
    {
        return $this->belongsTo(AccidentItem::class);
    }
}
