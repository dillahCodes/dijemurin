<?php

namespace Database\Seeders;

use App\Models\Outlet\Outlet;
use App\Models\Service\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $outlets = Outlet::all();

        foreach ($outlets as $outlet) {
            Service::factory(50)->create([
                'outlet_id' => $outlet->id,
            ]);
        }
    }
}
