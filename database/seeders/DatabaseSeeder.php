<?php

namespace Database\Seeders;

use App\Models\Service;
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
        $this->seedServices();
    }


    /**
     * Seed default user
     */
    private function seedUser(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);
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