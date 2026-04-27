<?php

namespace Database\Factories\Service;

use App\Models\Service\ServiceItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceItem>
 */
class ServiceItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->bothify('Item ???? ####'),
            'description' => fake()->sentence(),
            'time' => fake()->randomElement(['4 Jam', '8 Jam', '12 Jam', '1 Hari', '2 Hari', '3 Hari']),
            'price' => fake()->randomElement([10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000]),
            'unit' => fake()->randomElement(['kg', 'pcs', 'meter', 'pasang', 'buah']),
        ];
    }
}
