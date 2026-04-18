<?php

namespace Database\Seeders;

use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedUser();
    }

    /**
     * Seed 100 users with varied roles and statuses.
     */
    private function seedUser(): void
    {
        $statuses = UserStatus::cases();

        // 1 Super Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'password' => bcrypt('password'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        // 5 Admin
        for ($i = 1; $i <= 5; $i++) {
            User::factory()->create([
                'name' => "Admin {$i}",
                'email' => "admin{$i}@gmail.com",
                'password' => bcrypt('password'),
                'role' => UserRole::ADMIN,
                'status' => $statuses[array_rand($statuses)],
            ]);
        }

        // 94 Kasir & Operator
        for ($i = 1; $i <= 94; $i++) {
            $role = $i % 2 === 0 ? UserRole::CASHIER : UserRole::OPERATOR;
            $roleName = $role === UserRole::CASHIER ? 'Kasir' : 'Operator';

            User::factory()->create([
                'name' => "{$roleName} {$i}",
                'email' => strtolower("{$roleName}{$i}@gmail.com"),
                'password' => bcrypt('password'),
                'role' => $role,
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}
