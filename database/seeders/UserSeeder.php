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
        $outlets = Outlet::all();

        if ($outlets->isEmpty()) {
            $this->command->warn('Outlet kosong. Jalankan OutletSeeder terlebih dahulu.');

            return;
        }

        $margonda = $outlets->where('name', 'DijeMurin Laundry - Margonda')->first();
        $tebet = $outlets->where('name', 'DijeMurin Laundry - Tebet')->first();
        $binus = $outlets->where('name', 'DijeMurin Laundry - Binus')->first();

        // 1. Outlet Margonda
        if ($margonda) {
            User::create([
                'name' => 'Budi Santoso',
                'email' => 'budi.admin@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::ADMIN,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $margonda->id,
            ]);

            User::create([
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.kasir@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::CASHIER,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $margonda->id,
            ]);

            User::create([
                'name' => 'Eko Prasetyo',
                'email' => 'eko.operator@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::OPERATOR,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $margonda->id,
            ]);

            User::create([
                'name' => 'Agus Supriyanto',
                'email' => 'agus.ghost@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::GHOST,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $margonda->id,
            ]);
        }

        // 2. Outlet Tebet
        if ($tebet) {
            User::create([
                'name' => 'Rini Astuti',
                'email' => 'rini.admin@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::ADMIN,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $tebet->id,
            ]);

            User::create([
                'name' => 'Dewi Lestari',
                'email' => 'dewi.kasir@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::CASHIER,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $tebet->id,
            ]);

            User::create([
                'name' => 'Fitri Handayani',
                'email' => 'fitri.operator@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::OPERATOR,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $tebet->id,
            ]);

            User::create([
                'name' => 'Siti Rahayu',
                'email' => 'siti.ghost@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::GHOST,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $tebet->id,
            ]);
        }

        // 3. Outlet Binus
        if ($binus) {
            User::create([
                'name' => 'Hendra Wijaya',
                'email' => 'hendra.admin@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::ADMIN,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $binus->id,
            ]);

            User::create([
                'name' => 'Joko Widodo',
                'email' => 'joko.kasir@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::CASHIER,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $binus->id,
            ]);

            User::create([
                'name' => 'Nanda Putra',
                'email' => 'nanda.operator@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::OPERATOR,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $binus->id,
            ]);

            User::create([
                'name' => 'Bella Safitri',
                'email' => 'bella.ghost@gmail.com',
                'password' => bcrypt('password'),
                'role' => UserRole::GHOST,
                'status' => UserStatus::ACTIVE,
                'outlet_id' => $binus->id,
            ]);
        }
    }
}
