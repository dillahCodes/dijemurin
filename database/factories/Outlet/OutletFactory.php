<?php

namespace Database\Factories\Outlet;

use App\Enums\Outlet\OutletStatus;
use App\Models\Outlet\Outlet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Outlet>
 */
class OutletFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Outlet::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Outlet '.$this->faker->company(),
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'status' => OutletStatus::ACTIVE,
        ];
    }
}
