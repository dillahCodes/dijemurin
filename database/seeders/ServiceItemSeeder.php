<?php

namespace Database\Seeders;

use App\Enums\Service\ServiceTimeType;
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
        $services = Service::all();

        foreach ($services as $service) {
            if ($service->name === 'Cuci Kiloan') {
                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Cuci Kiloan Reguler (2 Hari)',
                    'description' => 'Cuci lipat standar selesai dalam 2 hari.',
                    'time_number' => 2,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 7000,
                    'unit' => 'kg',
                ]);

                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Cuci Kiloan Kilat (1 Hari)',
                    'description' => 'Cuci lipat cepat selesai dalam 1 hari.',
                    'time_number' => 1,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 10000,
                    'unit' => 'kg',
                ]);

                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Cuci Kiloan Express (6 Jam)',
                    'description' => 'Cuci lipat super cepat selesai dalam 6 jam.',
                    'time_number' => 6,
                    'time_type' => ServiceTimeType::HOUR,
                    'price' => 15000,
                    'unit' => 'kg',
                ]);
            } elseif ($service->name === 'Cuci Setrika') {
                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Cuci Setrika Reguler (2 Hari)',
                    'description' => 'Cuci gosok lipat standar selesai dalam 2 hari.',
                    'time_number' => 2,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 9000,
                    'unit' => 'kg',
                ]);

                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Cuci Setrika Kilat (1 Hari)',
                    'description' => 'Cuci gosok lipat cepat selesai dalam 1 hari.',
                    'time_number' => 1,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 13000,
                    'unit' => 'kg',
                ]);

                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Cuci Setrika Express (6 Jam)',
                    'description' => 'Cuci gosok lipat super cepat selesai dalam 6 jam.',
                    'time_number' => 6,
                    'time_type' => ServiceTimeType::HOUR,
                    'price' => 18000,
                    'unit' => 'kg',
                ]);
            } elseif ($service->name === 'Dry Cleaning & Satuan') {
                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Dry Cleaning Kemeja / Blouse',
                    'description' => 'Cuci premium satuan untuk kemeja atau blouse.',
                    'time_number' => 3,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 15000,
                    'unit' => 'pcs',
                ]);

                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Dry Cleaning Jas / Blazer',
                    'description' => 'Cuci premium satuan untuk jas formal pria/wanita.',
                    'time_number' => 3,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 35000,
                    'unit' => 'pcs',
                ]);

                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Dry Cleaning Bed Cover Double',
                    'description' => 'Cuci premium satuan untuk bed cover ukuran besar.',
                    'time_number' => 3,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 45000,
                    'unit' => 'pcs',
                ]);

                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Cuci Sepatu Sneakers',
                    'description' => 'Pembersihan mendalam premium untuk sepatu sneakers.',
                    'time_number' => 4,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 40000,
                    'unit' => 'pasang',
                ]);
            } elseif ($service->name === 'Setrika Saja') {
                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Setrika Reguler (2 Hari)',
                    'description' => 'Gosok lipat pakaian standar selesai dalam 2 hari.',
                    'time_number' => 2,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 5000,
                    'unit' => 'kg',
                ]);

                ServiceItem::create([
                    'service_id' => $service->id,
                    'name' => 'Setrika Kilat (1 Hari)',
                    'description' => 'Gosok lipat pakaian cepat selesai dalam 1 hari.',
                    'time_number' => 1,
                    'time_type' => ServiceTimeType::DAY,
                    'price' => 8000,
                    'unit' => 'kg',
                ]);
            }
        }
    }
}
