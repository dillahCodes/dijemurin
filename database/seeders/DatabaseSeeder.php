<?php

namespace Database\Seeders;

use App\Enums\User\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->seedUser();
        $this->call(ServiceSeeder::class);
        $this->call(ServiceItemSeeder::class);
        $this->call(OrderSeeder::class);
    }

    /**
     * Seed default user
     */
    private function seedUser(): void
    {
        $users = [
            ['name' => 'Super Admin', 'email' => 'superadmin@gmail.com', 'role' => UserRole::SUPER_ADMIN],
            ['name' => 'Admin', 'email' => 'admin@gmail.com', 'role' => UserRole::ADMIN],
            ['name' => 'Kasir', 'email' => 'kasir@gmail.com', 'role' => UserRole::CASHIER],
            ['name' => 'Operator', 'email' => 'operator@gmail.com', 'role' => UserRole::OPERATOR],
        ];

        foreach ($users as $user) {
            User::factory()->create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => bcrypt('password'),
                'role' => $user['role']->value,
            ]);
        }
    }
}
