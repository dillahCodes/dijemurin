<?php

namespace Database\Seeders;

use App\Enums\Accident\AccidentStatus;
use App\Enums\User\UserRole;
use App\Models\Accident\Accident;
use App\Models\Accident\AccidentLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class AccidentLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accidents = Accident::all();
        $admins = User::whereIn('role', [UserRole::ADMIN, UserRole::SUPER_ADMIN])->get();

        foreach ($accidents as $accident) {
            $this->seedLogsForAccident($accident, $admins);
        }
    }

    /**
     * Seed logs for a single accident sequentially based on its current status.
     */
    private function seedLogsForAccident(Accident $accident, $admins): void
    {
        $createdAt = $accident->created_at;
        $reporterId = $accident->reporter_id;
        $resolverId = $accident->resolver_id ?? ($admins->isNotEmpty() ? $admins->random()->id : null);

        // Log 1: null -> pending (when accident was reported)
        AccidentLog::create([
            'accident_id' => $accident->id,
            'user_id' => $reporterId,
            'field_name' => 'status',
            'old_value' => null,
            'new_value' => AccidentStatus::PENDING->value,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);

        if ($accident->status === AccidentStatus::PENDING) {
            return;
        }

        if ($accident->status === AccidentStatus::INVESTIGATING) {
            // Log 2: pending -> investigating
            $investigatingAt = $createdAt->copy()->addHours(rand(1, 24));
            AccidentLog::create([
                'accident_id' => $accident->id,
                'user_id' => $resolverId,
                'field_name' => 'status',
                'old_value' => AccidentStatus::PENDING->value,
                'new_value' => AccidentStatus::INVESTIGATING->value,
                'created_at' => $investigatingAt,
                'updated_at' => $investigatingAt,
            ]);

            return;
        }

        // For RESOLVED and REJECTED, they can go through investigating or directly from pending
        $resolvedAt = $accident->resolved_at ?? $createdAt->copy()->addDays(rand(1, 5));
        $goesThroughInvestigating = rand(0, 1) === 1;

        if ($goesThroughInvestigating) {
            // Log 2: pending -> investigating
            $investigatingAt = $createdAt->copy()->addMinutes(rand(30, 1440)); // within 24 hours
            AccidentLog::create([
                'accident_id' => $accident->id,
                'user_id' => $resolverId,
                'field_name' => 'status',
                'old_value' => AccidentStatus::PENDING->value,
                'new_value' => AccidentStatus::INVESTIGATING->value,
                'created_at' => $investigatingAt,
                'updated_at' => $investigatingAt,
            ]);

            // Log 3: investigating -> resolved/rejected
            AccidentLog::create([
                'accident_id' => $accident->id,
                'user_id' => $resolverId,
                'field_name' => 'status',
                'old_value' => AccidentStatus::INVESTIGATING->value,
                'new_value' => $accident->status->value,
                'created_at' => $resolvedAt,
                'updated_at' => $resolvedAt,
            ]);
        } else {
            // Log 2: pending -> resolved/rejected
            AccidentLog::create([
                'accident_id' => $accident->id,
                'user_id' => $resolverId,
                'field_name' => 'status',
                'old_value' => AccidentStatus::PENDING->value,
                'new_value' => $accident->status->value,
                'created_at' => $resolvedAt,
                'updated_at' => $resolvedAt,
            ]);
        }
    }
}
