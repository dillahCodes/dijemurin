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

class DashboardCancelledSummaryCardTest extends TestCase
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
     * Test cancelled order summary statistics calculation and dashboard values for roles.
     */
    public function test_dashboard_cancelled_statistics_per_role(): void
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

        // Initially no cancelled orders
        $this->assertEquals(0, OrderStatsService::getCancelledTodayCount());
        $this->assertEquals(0, OrderStatsService::getCancelledThisMonthCount());
        $this->assertEquals(0, OrderStatsService::getCancelledTodayCountForOutlet($this->outlet1->id));
        $this->assertEquals(0, OrderStatsService::getCancelledTodayCountForOutlet($this->outlet2->id));

        // -------------------------------------------------------------
        // Step 2: Transition orders to CANCELLED on June 30
        // -------------------------------------------------------------
        // Cancel Order 1 (Outlet 1)
        OrderService::updateOrder(['status' => OrderStatus::CANCELLED->value], $order1);

        // Cancel Order 2 (Outlet 2)
        OrderService::updateOrder(['status' => OrderStatus::CANCELLED->value], $order2);

        // Verify stats on June 30
        $this->assertEquals(2, OrderStatsService::getCancelledTodayCount());
        $this->assertEquals(2, OrderStatsService::getCancelledThisMonthCount());
        $this->assertEquals(1, OrderStatsService::getCancelledTodayCountForOutlet($this->outlet1->id));
        $this->assertEquals(1, OrderStatsService::getCancelledTodayCountForOutlet($this->outlet2->id));

        // 1. Super Admin: Sees total cancelled orders across all outlets
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.cancelledTodayAllOutlets', 2)
                ->where('stats.cancelledThisMonthAllOutlets', 2)
            );

        // 2. Admin (restricted to Outlet 1): Sees cancelled orders for Outlet 1
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.cancelledToday', 1)
            );

        // 3. Cashier (restricted to Outlet 1)
        $this->actingAs($this->cashier)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.cancelledToday', 1)
            );

        // -------------------------------------------------------------
        // Step 3: July 1 - Verify that June 30 cancellations are not counted as "today"
        // but are counted as "this month" for July if we look at the monthly totals (they won't be, since July is a new month)
        // -------------------------------------------------------------
        $this->travelTo(Carbon::parse('2026-07-01 10:00:00'));

        // On July 1, the June 30 cancellations should be 0 for today and 0 for this month
        $this->assertEquals(0, OrderStatsService::getCancelledTodayCount());
        $this->assertEquals(0, OrderStatsService::getCancelledThisMonthCount());
        $this->assertEquals(0, OrderStatsService::getCancelledTodayCountForOutlet($this->outlet1->id));

        // 1. Super Admin on July 1
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.cancelledTodayAllOutlets', 0)
                ->where('stats.cancelledThisMonthAllOutlets', 0)
            );

        // 2. Admin on July 1
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.cancelledToday', 0)
            );

        Carbon::setTestNow();
    }
}
