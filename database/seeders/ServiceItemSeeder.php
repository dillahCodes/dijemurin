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
        // To avoid memory exhaustion when working with 2500+ services, process in chunks
        Service::chunk(100, function ($services) {
            foreach ($services as $service) {
                ServiceItem::factory(3)->create([
                    'service_id' => $service->id,
                ]);
            }
        });
    }
}
