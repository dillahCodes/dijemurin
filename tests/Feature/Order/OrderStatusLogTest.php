<?php

namespace Tests\Feature\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Outlet\OutletStatus;
use App\Enums\Payment\PaymentMethod;
use App\Enums\Service\ServiceTimeType;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\Outlet\Outlet;
use App\Models\Service\Service;
use App\Models\Service\ServiceItem;
use App\Models\User;
use App\Services\Order\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusLogTest extends TestCase
{
    use RefreshDatabase;

    private User $cashier;

    private Outlet $outlet;

    private ServiceItem $serviceItem;

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

        $service = Service::create([
            'outlet_id' => $this->outlet->id,
            'name' => 'Cuci Basah',
            'description' => 'Test Service Description',
        ]);

        $this->serviceItem = ServiceItem::create([
            'service_id' => $service->id,
            'name' => 'Baju Biasa',
            'description' => 'Test Service Item Description',
            'time_number' => 2,
            'time_type' => ServiceTimeType::DAY->value,
            'price' => 5000,
            'unit' => 'kg',
        ]);
    }

    public function test_creating_order_logs_initial_pending_status(): void
    {
        $this->actingAs($this->cashier);

        $orderData = [
            'outlet_id' => $this->outlet->id,
            'customer_name' => 'John Doe',
            'payment_method' => PaymentMethod::CASH->value,
            'payment_amount' => 10000,
            'cart_items' => [
                [
                    'id' => $this->serviceItem->id,
                    'qty' => 2,
                ],
            ],
        ];

        $order = OrderService::createOrder($orderData);

        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id,
            'user_id' => $this->cashier->id,
            'from_status' => null,
            'to_status' => OrderStatus::PENDING->value,
        ]);
    }

    public function test_updating_order_status_logs_transition(): void
    {
        $this->actingAs($this->cashier);

        $orderData = [
            'outlet_id' => $this->outlet->id,
            'customer_name' => 'John Doe',
            'payment_method' => PaymentMethod::CASH->value,
            'payment_amount' => 10000,
            'cart_items' => [
                [
                    'id' => $this->serviceItem->id,
                    'qty' => 2,
                ],
            ],
        ];

        $order = OrderService::createOrder($orderData);

        // Update to PROCESS
        $updatedOrder = OrderService::updateOrder([
            'status' => OrderStatus::PROCESS->value,
        ], $order);

        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id,
            'user_id' => $this->cashier->id,
            'from_status' => OrderStatus::PENDING->value,
            'to_status' => OrderStatus::PROCESS->value,
        ]);

        $this->assertEquals(2, $order->statusLogs()->count());
    }

    public function test_updating_order_with_same_status_does_not_log(): void
    {
        $this->actingAs($this->cashier);

        $orderData = [
            'outlet_id' => $this->outlet->id,
            'customer_name' => 'John Doe',
            'payment_method' => PaymentMethod::CASH->value,
            'payment_amount' => 10000,
            'cart_items' => [
                [
                    'id' => $this->serviceItem->id,
                    'qty' => 2,
                ],
            ],
        ];

        $order = OrderService::createOrder($orderData);

        // Update to same status
        $updatedOrder = OrderService::updateOrder([
            'status' => OrderStatus::PENDING->value,
        ], $order);

        $this->assertEquals(1, $order->statusLogs()->count());
    }
}
