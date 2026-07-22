<?php

namespace Tests\Feature\Dashboard;

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
use App\Services\Order\OrderStatsService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardOrderSummaryCardTest extends TestCase
{
    use RefreshDatabase;

    private Outlet $outlet1;

    private Outlet $outlet2;

    private User $superAdmin;

    private User $admin;

    private User $cashier;

    private User $operator;

    private ServiceItem $serviceItem1;

    private ServiceItem $serviceItem2;

    protected function setUp(): void
    {
        parent::setUp();

        // Create Outlets
        $this->outlet1 = Outlet::create([
            'name' => 'Outlet Bandung',
            'address' => 'Jl. Bandung No. 1',
            'phone' => '081234567890',
            'status' => OutletStatus::ACTIVE,
        ]);

        $this->outlet2 = Outlet::create([
            'name' => 'Outlet Jakarta',
            'address' => 'Jl. Jakarta No. 2',
            'phone' => '081234567891',
            'status' => OutletStatus::ACTIVE,
        ]);

        // Create Users for Outlet 1
        $this->admin = User::create([
            'name' => 'Outlet 1 Admin',
            'email' => 'admin1@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::ADMIN,
            'status' => UserStatus::ACTIVE,
            'outlet_id' => $this->outlet1->id,
        ]);

        $this->cashier = User::create([
            'name' => 'Outlet 1 Cashier',
            'email' => 'cashier1@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::CASHIER,
            'status' => UserStatus::ACTIVE,
            'outlet_id' => $this->outlet1->id,
        ]);

        $this->operator = User::create([
            'name' => 'Outlet 1 Operator',
            'email' => 'operator1@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::OPERATOR,
            'status' => UserStatus::ACTIVE,
            'outlet_id' => $this->outlet1->id,
        ]);

        // Create Super Admin
        $this->superAdmin = User::create([
            'name' => 'Super Admin User',
            'email' => 'superadmin@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        // Create Services
        $service1 = Service::create([
            'outlet_id' => $this->outlet1->id,
            'name' => 'Cuci Kilat Outlet 1',
            'description' => 'Service 1',
        ]);

        $service2 = Service::create([
            'outlet_id' => $this->outlet2->id,
            'name' => 'Cuci Kilat Outlet 2',
            'description' => 'Service 2',
        ]);

        // Create Service Items
        $this->serviceItem1 = ServiceItem::create([
            'service_id' => $service1->id,
            'name' => 'Baju Kilat',
            'description' => 'Item 1',
            'time_number' => 1,
            'time_type' => ServiceTimeType::DAY->value,
            'price' => 50000,
            'unit' => 'kg',
        ]);

        $this->serviceItem2 = ServiceItem::create([
            'service_id' => $service2->id,
            'name' => 'Baju Kilat 2',
            'description' => 'Item 2',
            'time_number' => 1,
            'time_type' => ServiceTimeType::DAY->value,
            'price' => 30000,
            'unit' => 'kg',
        ]);
    }

    /**
     * Test order summary statistics calculation and dashboard values for all roles.
     */
    public function test_dashboard_order_statistics_per_role(): void
    {
        // -------------------------------------------------------------
        // Step 1: June 30 - Orders created (Pending status)
        // -------------------------------------------------------------
        $this->travelTo(Carbon::parse('2026-06-30 12:00:00'));

        // Create Order 1 in Outlet 1
        $this->actingAs($this->cashier);
        $order1 = OrderService::createOrder([
            'outlet_id' => $this->outlet1->id,
            'customer_name' => 'John Doe',
            'payment_method' => PaymentMethod::CASH->value,
            'payment_amount' => 50000,
            'cart_items' => [
                [
                    'id' => $this->serviceItem1->id,
                    'qty' => 1,
                ],
            ],
        ]);

        // Create Order 2 in Outlet 2
        $this->actingAs($this->superAdmin);
        $order2 = OrderService::createOrder([
            'outlet_id' => $this->outlet2->id,
            'customer_name' => 'Jane Smith',
            'payment_method' => PaymentMethod::QRIS->value,
            'payment_amount' => 30000,
            'cart_items' => [
                [
                    'id' => $this->serviceItem2->id,
                    'qty' => 1,
                ],
            ],
        ]);

        // Verify stats on June 30
        $this->assertEquals(2, OrderStatsService::getTodayOrderCount());
        $this->assertEquals(2, OrderStatsService::getThisMonthOrderCount());
        $this->assertEquals(1, OrderStatsService::getTodayOrderCountForOutlet($this->outlet1->id));
        $this->assertEquals(1, OrderStatsService::getTodayOrderCountForOutlet($this->outlet2->id));

        // 1. Super Admin: Sees total orders across all outlets
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.todayOrdersAllOutlets', 2)
                ->where('stats.thisMonthOrdersAllOutlets', 2)
            );

        // 2. Admin (restricted to Outlet 1): Sees orders for Outlet 1
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.todayOrders', 1)
                ->where('stats.completedToday', 0)
                ->where('stats.pickedUpToday', 0)
            );

        // 3. Cashier (restricted to Outlet 1)
        $this->actingAs($this->cashier)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.todayOrders', 1)
            );

        // 4. Operator (restricted to Outlet 1)
        $this->actingAs($this->operator)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.completedToday', 0)
                ->where('stats.pickedUpToday', 0)
                ->where('stats.readyOrders', 0)
            );

        // -------------------------------------------------------------
        // Step 2: July 1 - Orders are transitioned (Done & Picked Up)
        // -------------------------------------------------------------
        $this->travelTo(Carbon::parse('2026-07-01 10:00:00'));

        // Transition Order 1 to DONE (in Outlet 1)
        $this->actingAs($this->cashier);
        OrderService::updateOrder(['status' => OrderStatus::DONE->value], $order1);

        // Transition Order 2 to DONE and then PICKED_UP (in Outlet 2)
        $this->actingAs($this->superAdmin);
        OrderService::updateOrder(['status' => OrderStatus::DONE->value], $order2);
        OrderService::updateOrder(['status' => OrderStatus::PICKED_UP->value], $order2);

        // Verify stats on July 1 (creation date was June 30, so today's created orders = 0, this month's created orders = 0)
        $this->assertEquals(0, OrderStatsService::getTodayOrderCount());
        $this->assertEquals(0, OrderStatsService::getThisMonthOrderCount());

        // Outlet specific completed and picked up counts today
        $this->assertEquals(1, OrderStatsService::getCompletedTodayCountForOutlet($this->outlet1->id));
        $this->assertEquals(0, OrderStatsService::getPickedUpTodayCountForOutlet($this->outlet1->id));
        $this->assertEquals(1, OrderStatsService::getCompletedTodayCountForOutlet($this->outlet2->id));
        $this->assertEquals(1, OrderStatsService::getPickedUpTodayCountForOutlet($this->outlet2->id));

        // Ready orders count (DONE status waiting to be picked up)
        $this->assertEquals(1, OrderStatsService::getDoneOrderCountForOutlet($this->outlet1->id));
        $this->assertEquals(0, OrderStatsService::getDoneOrderCountForOutlet($this->outlet2->id));

        // 1. Super Admin
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.todayOrdersAllOutlets', 0)
                ->where('stats.thisMonthOrdersAllOutlets', 0)
            );

        // 2. Admin (restricted to Outlet 1)
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.todayOrders', 0)
                ->where('stats.completedToday', 1)
                ->where('stats.pickedUpToday', 0)
            );

        // 3. Operator (restricted to Outlet 1)
        $this->actingAs($this->operator)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.completedToday', 1)
                ->where('stats.pickedUpToday', 0)
                ->where('stats.readyOrders', 1) // Order 1 is DONE
            );

        Carbon::setTestNow();
    }
}
