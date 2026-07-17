<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(OutletSeeder::class);
        $this->call(SuperAdminSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(ServiceSeeder::class);
        $this->call(ServiceItemSeeder::class);
        $this->call(OrderSeeder::class);
        $this->call(OrderStatusLogSeeder::class);
        $this->call(AccidentSeeder::class);
        $this->call(AccidentLogSeeder::class);
    }
}
