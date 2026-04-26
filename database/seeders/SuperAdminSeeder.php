<?php

namespace Database\Seeders;

use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\User;
use App\Notifications\SetPasswordNotification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedSuperAdmin();
    }

    private function seedSuperAdmin(): void
    {
        $superAdmin = User::firstOrCreate(
            [
                'email' => config('app.super_admin_email')
            ],
            [
                'name' => 'Super Admin',
                'password' => Str::random(16),
                'role' => UserRole::SUPER_ADMIN,
                'status' => UserStatus::ACTIVE,
            ]
        );

        if ($superAdmin->wasRecentlyCreated) {
            $token = Password::createToken($superAdmin);
            $superAdmin->notify(new SetPasswordNotification($token));

            echo "Super Admin created: {$superAdmin->email}, check email to set password!!\n";
        } else {
            echo "Super Admin already exists: {$superAdmin->email}\n";
        }
    }
}
