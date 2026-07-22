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
            Service::create([
                'outlet_id' => $outlet->id,
                'name' => 'Cuci Kiloan',
                'description' => 'Layanan cuci dan lipat pakaian harian berdasarkan berat timbangan.',
            ]);

            Service::create([
                'outlet_id' => $outlet->id,
                'name' => 'Cuci Setrika',
                'description' => 'Layanan cuci bersih, disetrika rapi, dan dilipat higienis.',
            ]);

            Service::create([
                'outlet_id' => $outlet->id,
                'name' => 'Dry Cleaning & Satuan',
                'description' => 'Cuci premium per potong untuk jas, kemeja, bed cover, sepatu, dll.',
            ]);

            Service::create([
                'outlet_id' => $outlet->id,
                'name' => 'Setrika Saja',
                'description' => 'Layanan setrika pakaian hingga rapi dan siap pakai tanpa proses cuci.',
            ]);
        }
    }
}
