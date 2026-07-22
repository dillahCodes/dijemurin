<?php

namespace Tests\Feature\Accident;

use App\Enums\Accident\AccidentCompensationType;
use App\Enums\Accident\AccidentStatus;
use App\Enums\Accident\AccidentType;
use App\Enums\Order\OrderStatus;
use App\Enums\Outlet\OutletStatus;
use App\Enums\Service\ServiceTimeType;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\Accident\Accident;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Models\Outlet\Outlet;
use App\Models\Service\Service;
use App\Models\Service\ServiceItem;
use App\Models\User;
use App\Services\Accident\AccidentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccidentLogTest extends TestCase
{
    use RefreshDatabase;

    private User $cashier;

    private User $admin;

    private User $superAdmin;

    private Outlet $outlet;

    private Order $order;

    private OrderItem $orderItem;

    protected function setUp(): void
    {
        parent::setUp();

        $this->outlet = Outlet::create([
            'name' => 'Test Outlet',
            'address' => 'Test Address',
            'phone' => '08123456789',
            'status' => OutletStatus::ACTIVE,
        ]);

        $this->cashier = User::create([
            'name' => 'Test Cashier',
            'email' => 'cashier@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::CASHIER,
            'status' => UserStatus::ACTIVE,
            'outlet_id' => $this->outlet->id,
        ]);

        $this->admin = User::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::ADMIN,
            'status' => UserStatus::ACTIVE,
            'outlet_id' => $this->outlet->id,
        ]);

        $this->superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $service = Service::create([
            'outlet_id' => $this->outlet->id,
            'name' => 'Cuci Kering',
            'description' => 'Test Service Description',
        ]);

        $serviceItem = ServiceItem::create([
            'service_id' => $service->id,
            'name' => 'Baju Satuan',
            'description' => 'Test Service Item Description',
            'time_number' => 2,
            'time_type' => ServiceTimeType::DAY->value,
            'price' => 5000,
            'unit' => 'pcs',
        ]);

        $this->order = Order::create([
            'outlet_id' => $this->outlet->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-TEST-123',
            'customer_name' => 'Jane Doe',
            'total_price' => 15000,
            'status' => OrderStatus::PENDING,
        ]);

        $this->orderItem = OrderItem::create([
            'order_id' => $this->order->id,
            'service_item_id' => $serviceItem->id,
            'item_name' => 'Kemeja Biru',
            'item_price' => 5000,
            'unit' => 'pcs',
            'quantity' => 1,
            'subtotal' => 5000,
        ]);
    }

    public function test_creating_accident_logs_initial_pending_status(): void
    {
        $this->actingAs($this->cashier);

        $accidentData = [
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'description' => 'Sobek karena mesin pengering',
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Sobek karena mesin pengering',
                ],
            ],
        ];

        $accident = AccidentService::createAccident($accidentData);

        $this->assertDatabaseHas('accident_logs', [
            'accident_id' => $accident->id,
            'user_id' => $this->cashier->id,
            'field_name' => 'status',
            'old_value' => null,
            'new_value' => AccidentStatus::PENDING->value,
        ]);
    }

    public function test_updating_accident_status_logs_transition(): void
    {
        $this->actingAs($this->cashier);

        $accidentData = [
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'description' => 'Sobek karena mesin pengering',
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Sobek karena mesin pengering',
                ],
            ],
        ];

        $accident = AccidentService::createAccident($accidentData);

        // Update to INVESTIGATING by Admin
        $this->actingAs($this->admin);

        $updatedAccident = AccidentService::updateAccident([
            'status' => AccidentStatus::INVESTIGATING->value,
        ], $accident);

        $this->assertDatabaseHas('accident_logs', [
            'accident_id' => $accident->id,
            'user_id' => $this->admin->id,
            'field_name' => 'status',
            'old_value' => AccidentStatus::PENDING->value,
            'new_value' => AccidentStatus::INVESTIGATING->value,
        ]);

        $this->assertEquals(2, $accident->logs()->count());
    }

    public function test_updating_accident_with_same_status_does_not_log(): void
    {
        $this->actingAs($this->cashier);

        $accidentData = [
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'description' => 'Sobek karena mesin pengering',
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Sobek karena mesin pengering',
                ],
            ],
        ];

        $accident = AccidentService::createAccident($accidentData);

        // Update to PENDING (same status)
        $updatedAccident = AccidentService::updateAccident([
            'status' => AccidentStatus::PENDING->value,
        ], $accident);

        $this->assertEquals(1, $accident->logs()->count());
    }

    public function test_show_page_returns_accident_details_with_loaded_relations(): void
    {
        $this->actingAs($this->cashier);

        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Kemeja robek',
            'status' => AccidentStatus::PENDING,
        ]);

        $accident->items()->create([
            'order_item_id' => $this->orderItem->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Kemeja robek',
        ]);

        $response = $this->get(route('accidents.show', $accident));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('accident/detail')
            ->has('accident.data')
            ->has('accident.data.logs')
            ->where('accident.data.id', $accident->id)
        );
    }

    public function test_updating_accident_description_logs_changes(): void
    {
        $this->actingAs($this->cashier);

        $accidentData = [
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'description' => 'Sobek karena mesin pengering',
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Sobek karena mesin pengering',
                ],
            ],
        ];

        $accident = AccidentService::createAccident($accidentData);

        // Update description by cashier
        $updatedAccident = AccidentService::updateAccident([
            'description' => 'Sobek parah di bagian pundak',
        ], $accident);

        $this->assertDatabaseHas('accident_logs', [
            'accident_id' => $accident->id,
            'user_id' => $this->cashier->id,
            'accident_item_id' => null,
            'field_name' => 'description',
            'old_value' => 'Sobek karena mesin pengering',
            'new_value' => 'Sobek parah di bagian pundak',
        ]);
    }

    public function test_updating_accident_item_compensation_logs_changes(): void
    {
        $this->actingAs($this->cashier);

        $accidentData = [
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'description' => 'Sobek karena mesin pengering',
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Sobek karena mesin pengering',
                ],
            ],
        ];

        $accident = AccidentService::createAccident($accidentData);
        $item = $accident->items()->first();

        // Update items by admin
        $this->actingAs($this->admin);

        $updatedAccident = AccidentService::updateAccident([
            'items' => [
                [
                    'id' => $item->id,
                    'type' => $item->type->value,
                    'item_details' => 'Kemeja biru',
                    'description' => 'Sobek parah',
                    'compensation_type' => AccidentCompensationType::REFUND->value,
                    'compensation_amount' => 50000,
                ],
            ],
        ], $accident);

        $this->assertDatabaseHas('accident_logs', [
            'accident_id' => $accident->id,
            'user_id' => $this->admin->id,
            'accident_item_id' => $item->id,
            'field_name' => 'compensation_amount',
            'old_value' => null,
            'new_value' => '50000',
        ]);

        $this->assertDatabaseHas('accident_logs', [
            'accident_id' => $accident->id,
            'user_id' => $this->admin->id,
            'accident_item_id' => $item->id,
            'field_name' => 'compensation_type',
            'old_value' => null,
            'new_value' => AccidentCompensationType::REFUND->value,
        ]);
    }

    public function test_updating_accident_with_same_values_does_not_log_changes(): void
    {
        $this->actingAs($this->cashier);

        $accidentData = [
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'description' => 'Sobek karena mesin pengering',
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Sobek karena mesin pengering',
                ],
            ],
        ];

        $accident = AccidentService::createAccident($accidentData);

        // Update description with same value
        $updatedAccident = AccidentService::updateAccident([
            'description' => 'Sobek karena mesin pengering',
        ], $accident);

        // Should only have initial status PENDING log (1 log total)
        $this->assertEquals(1, $accident->logs()->count());
    }
}
