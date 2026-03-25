<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedServices();
    }

    /**
     * Seed services
     */
    private function seedServices(): void
    {
        $services = [
            [
                'name' => 'Laundry Karpet',
                'description' => 'Jasa cuci karpet',
            ],
            [
                'name' => 'Laundry Kiloan',
                'description' => 'Jasa cuci kiloan',
            ],
            [
                'name' => 'Setrika Saja',
                'description' => 'Jasa setrika saja',
            ],
            [
                'name' => 'Laundry Stroller & Perlengkapan Bayi',
                'description' => 'Jasa cuci stroller & perlengkapan bayi',
            ],
            [
                'name' => 'Laundry Sepatu',
                'description' => 'Jasa cuci sepatu',
            ],
            [
                'name' => 'Laundry Bed Cover',
                'description' => 'Jasa cuci bed cover',
            ],
            [
                'name' => 'Laundry Bantal',
                'description' => 'Jasa cuci bantal',
            ],
            [
                'name' => 'Laundry Boneka',
                'description' => 'Jasa cuci boneka',
            ],
        ];

        foreach ($services as $service) {
            Service::factory()->create($service);
        }
    }
}
