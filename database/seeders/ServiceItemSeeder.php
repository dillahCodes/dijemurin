<?php

namespace Database\Seeders;

use App\Models\Service\Service;
use App\Models\Service\ServiceItem;
use Illuminate\Database\Seeder;

class ServiceItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedLaundryKiloanItems();
        $this->seedLaundryKarpetItems();
        $this->seedSetrikaSajaItems();
        $this->seedStrollerItems();
        $this->seedSepatuItems();
        $this->seedBedCoverItems();
        $this->seedBantalItems();
        $this->seedBonekaItems();
    }

    private function createItems(string $serviceName, array $items): void
    {
        $service = Service::where('name', $serviceName)->first();

        if (! $service) {
            return;
        }

        foreach ($items as $item) {
            ServiceItem::create([...$item, 'service_id' => $service->id]);
        }
    }

    /**
     * Seed: Laundry Kiloan
     */
    private function seedLaundryKiloanItems(): void
    {
        $this->createItems('Laundry Kiloan', [
            [
                'name' => 'Laundry 4 Jam Selesai',
                'description' => 'Cuci Kering + Setrika + Packing',
                'time' => '4 Jam',
                'price' => 35000,
                'unit' => 'kg',
            ],
            [
                'name' => 'Laundry 8 Jam Selesai',
                'description' => 'Cuci Kering + Setrika + Packing',
                'time' => '8 Jam',
                'price' => 30000,
                'unit' => 'kg',
            ],
            [
                'name' => 'Laundry 12 Jam Selesai',
                'description' => 'Cuci Kering + Setrika + Packing',
                'time' => '12 Jam',
                'price' => 25000,
                'unit' => 'kg',
            ],
            [
                'name' => 'Laundry 24 Jam Selesai',
                'description' => 'Cuci Kering + Setrika + Packing',
                'time' => '24 Jam',
                'price' => 20000,
                'unit' => 'kg',
            ],
            [
                'name' => 'Laundry 48 Jam Selesai',
                'description' => 'Cuci Kering + Setrika + Packing',
                'time' => '48 Jam',
                'price' => 11000,
                'unit' => 'kg',
            ],
        ]);
    }

    /**
     * Seed: Laundry Karpet
     */
    private function seedLaundryKarpetItems(): void
    {
        $this->createItems('Laundry Karpet', [
            [
                'name' => 'Karpet Kecil (100x150 cm)',
                'description' => 'Cuci Kering + Packing',
                'time' => '3 Hari',
                'price' => 50000,
                'unit' => 'pcs',
            ],
            [
                'name' => 'Karpet Sedang (150x200 cm)',
                'description' => 'Cuci Kering + Packing',
                'time' => '3 Hari',
                'price' => 75000,
                'unit' => 'pcs',
            ],
            [
                'name' => 'Karpet Besar (200x300 cm)',
                'description' => 'Cuci Kering + Packing',
                'time' => '3 Hari',
                'price' => 120000,
                'unit' => 'pcs',
            ],
        ]);
    }

    /**
     * Seed: Setrika Saja
     */
    private function seedSetrikaSajaItems(): void
    {
        $this->createItems('Setrika Saja', [
            [
                'name' => 'Setrika 4 Jam Selesai',
                'description' => 'Setrika + Packing',
                'time' => '4 Jam',
                'price' => 8000,
                'unit' => 'kg',
            ],
            [
                'name' => 'Setrika 8 Jam Selesai',
                'description' => 'Setrika + Packing',
                'time' => '8 Jam',
                'price' => 7000,
                'unit' => 'kg',
            ],
            [
                'name' => 'Setrika 24 Jam Selesai',
                'description' => 'Setrika + Packing',
                'time' => '24 Jam',
                'price' => 5000,
                'unit' => 'kg',
            ],
        ]);
    }

    /**
     * Seed: Laundry Stroller & Perlengkapan Bayi
     */
    private function seedStrollerItems(): void
    {
        $this->createItems('Laundry Stroller & Perlengkapan Bayi', [
            [
                'name' => 'Cuci Stroller',
                'description' => 'Cuci + Sanitasi + Packing',
                'time' => '3 Hari',
                'price' => 150000,
                'unit' => 'pcs',
            ],
            [
                'name' => 'Cuci Kursi Makan Bayi',
                'description' => 'Cuci + Sanitasi + Packing',
                'time' => '3 Hari',
                'price' => 75000,
                'unit' => 'pcs',
            ],
            [
                'name' => 'Cuci Perlengkapan Bayi',
                'description' => 'Cuci Kering + Packing',
                'time' => '2 Hari',
                'price' => 25000,
                'unit' => 'kg',
            ],
        ]);
    }

    /**
     * Seed: Laundry Sepatu
     */
    private function seedSepatuItems(): void
    {
        $this->createItems('Laundry Sepatu', [
            [
                'name' => 'Cuci Sneakers',
                'description' => 'Cuci + Sikat + Rapikan + Packing',
                'time' => '3 Hari',
                'price' => 45000,
                'unit' => 'pasang',
            ],
            [
                'name' => 'Cuci Sepatu Kulit',
                'description' => 'Cuci + Poles + Packing',
                'time' => '3 Hari',
                'price' => 65000,
                'unit' => 'pasang',
            ],
            [
                'name' => 'Cuci Sepatu Anak',
                'description' => 'Cuci + Sikat + Packing',
                'time' => '2 Hari',
                'price' => 30000,
                'unit' => 'pasang',
            ],
        ]);
    }

    /**
     * Seed: Laundry Bed Cover
     */
    private function seedBedCoverItems(): void
    {
        $this->createItems('Laundry Bed Cover', [
            [
                'name' => 'Bed Cover Single',
                'description' => 'Cuci Kering + Packing',
                'time' => '2 Hari',
                'price' => 35000,
                'unit' => 'pcs',
            ],
            [
                'name' => 'Bed Cover Double',
                'description' => 'Cuci Kering + Packing',
                'time' => '2 Hari',
                'price' => 50000,
                'unit' => 'pcs',
            ],
            [
                'name' => 'Bed Cover King',
                'description' => 'Cuci Kering + Packing',
                'time' => '2 Hari',
                'price' => 65000,
                'unit' => 'pcs',
            ],
        ]);
    }

    /**
     * Seed: Laundry Bantal
     */
    private function seedBantalItems(): void
    {
        $this->createItems('Laundry Bantal', [
            [
                'name' => 'Cuci Bantal Standar',
                'description' => 'Cuci Kering + Packing',
                'time' => '2 Hari',
                'price' => 20000,
                'unit' => 'buah',
            ],
            [
                'name' => 'Cuci Guling',
                'description' => 'Cuci Kering + Packing',
                'time' => '2 Hari',
                'price' => 25000,
                'unit' => 'buah',
            ],
        ]);
    }

    /**
     * Seed: Laundry Boneka
     */
    private function seedBonekaItems(): void
    {
        $this->createItems('Laundry Boneka', [
            [
                'name' => 'Boneka Kecil (< 30 cm)',
                'description' => 'Cuci Kering + Packing',
                'time' => '2 Hari',
                'price' => 20000,
                'unit' => 'buah',
            ],
            [
                'name' => 'Boneka Sedang (30 - 60 cm)',
                'description' => 'Cuci Kering + Packing',
                'time' => '2 Hari',
                'price' => 35000,
                'unit' => 'buah',
            ],
            [
                'name' => 'Boneka Besar (> 60 cm)',
                'description' => 'Cuci Kering + Packing',
                'time' => '3 Hari',
                'price' => 60000,
                'unit' => 'buah',
            ],
        ]);
    }
}
