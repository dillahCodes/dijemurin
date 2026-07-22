<?php

namespace Database\Seeders;

use App\Enums\Outlet\OutletStatus;
use App\Models\Outlet\Outlet;
use Illuminate\Database\Seeder;

class OutletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Outlet::create([
            'name' => 'DijeMurin Laundry - Margonda',
            'address' => 'Jl. Margonda Raya No. 12, Kota Depok, Jawa Barat',
            'phone' => '08123456789',
            'email' => 'margonda@dijemurin.com',
            'status' => OutletStatus::ACTIVE,
        ]);

        Outlet::create([
            'name' => 'DijeMurin Laundry - Tebet',
            'address' => 'Jl. Tebet Raya No. 45, Jakarta Selatan, DKI Jakarta',
            'phone' => '08129876543',
            'email' => 'tebet@dijemurin.com',
            'status' => OutletStatus::ACTIVE,
        ]);

        Outlet::create([
            'name' => 'DijeMurin Laundry - Binus',
            'address' => 'Jl. K.H. Syahdan No. 9, Palmerah, Jakarta Barat, DKI Jakarta',
            'phone' => '08131122334',
            'email' => 'binus@dijemurin.com',
            'status' => OutletStatus::ACTIVE,
        ]);
    }
}
