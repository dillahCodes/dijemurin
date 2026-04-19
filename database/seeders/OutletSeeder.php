<?php

namespace Database\Seeders;

use App\Models\Outlet\Outlet;
use Illuminate\Database\Seeder;

class OutletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Outlet::factory(50)->create();
    }
}
