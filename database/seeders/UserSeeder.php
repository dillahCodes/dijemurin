<?php

namespace Database\Seeders;

use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\Outlet\Outlet;
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
     * Seed users with varied roles, statuses, and outlets.
     */
    private function seedUser(): void
    {
        $statuses = UserStatus::cases();

        // Specific mapping for outlet assignments
        $outlets = Outlet::all();

        // If no outlets exist, just create a default list of users
        if ($outlets->isEmpty()) {
            $outlets = collect([null]);
        }

        $userId = 1; // used for generating unique names/emails

        // Exactly 1 Admin per outlet (or 1 stand-alone admin if outlet is null)
        foreach ($outlets as $outlet) {
            User::factory()->create([
                'name' => "Admin {$userId}",
                'email' => "admin{$userId}@gmail.com",
                'password' => bcrypt('password'),
                'role' => UserRole::ADMIN,
                'status' => $statuses[array_rand($statuses)],
                'outlet_id' => $outlet?->id,
            ]);
            $userId++;
        }

        // Generate the remaining users to reach exactly 150 total users
        $totalTargetUsers = 150;
        $currentUsersCount = 1 + $outlets->count(); // Super Admin + Admins
        $remainingUsersCount = $totalTargetUsers - $currentUsersCount;

        if ($remainingUsersCount > 0) {
            $roles = [UserRole::CASHIER, UserRole::OPERATOR, UserRole::GHOST];

            for ($i = 0; $i < $remainingUsersCount; $i++) {
                $role = $roles[array_rand($roles)];
                $roleName = match ($role) {
                    UserRole::CASHIER => 'Kasir',
                    UserRole::OPERATOR => 'Operator',
                    UserRole::GHOST => 'Ghost',
                };

                $outletId = $role === UserRole::GHOST ? null : $outlets->random()?->id;

                User::factory()->create([
                    'name' => "{$roleName} {$userId}",
                    'email' => strtolower($roleName)."{$userId}@gmail.com",
                    'password' => bcrypt('password'),
                    'role' => $role,
                    'status' => $statuses[array_rand($statuses)],
                    'outlet_id' => $outletId,
                ]);
                $userId++;
            }
        }
    }
}
