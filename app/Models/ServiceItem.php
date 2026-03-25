<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['name', 'description', 'time', 'price', 'unit', 'service_id'])]
class ServiceItem extends Model
{
    use HasFactory;

    protected function casts()
    {
        return [
            'name' => 'string',
            'description' => 'string',
            'time' => 'string',
            'price' => 'integer',
            'unit' => 'string',
            'service_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
