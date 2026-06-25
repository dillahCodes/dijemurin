<?php

namespace Tests\Feature\Dashboard;

use App\Enums\Order\OrderStatus;
use App\Enums\Outlet\OutletStatus;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\Order\Order;
use App\Models\Outlet\Outlet;
use App\Models\User;
use App\Services\Order\OrderStatsService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardCompletedSummaryCardTest extends TestCase
{
    use RefreshDatabase;

    private Outlet $outlet1;

    private Outlet $outlet2;

    private User $superAdmin;

    private User $admin;

    private User $cashier;

    private User $operator;

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

        // Create Super Admin (no outlet restriction)
        $this->superAdmin = User::create([
            'name' => 'Super Admin User',
            'email' => 'superadmin@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);
    }

    /**
     * Test scopeTodayCompleted filters orders correctly based on completed_at.
     */
    public function test_scope_today_completed_filters_correctly(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // 1. Order completed today (Included)
        $order1 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-001',
            'customer_name' => 'Customer 1',
            'total_price' => 50000,
            'status' => OrderStatus::DONE,
            'completed_at' => $now->copy()->addHours(2),
        ]);

        // 2. Order completed yesterday (Excluded)
        $order2 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-002',
            'customer_name' => 'Customer 2',
            'total_price' => 50000,
            'status' => OrderStatus::DONE,
            'completed_at' => $now->copy()->subDay(),
        ]);

        // 3. Order completed tomorrow (Excluded)
        $order3 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-003',
            'customer_name' => 'Customer 3',
            'total_price' => 50000,
            'status' => OrderStatus::DONE,
            'completed_at' => $now->copy()->addDay(),
        ]);

        // 4. Order completed_at is null (Excluded)
        $order4 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-004',
            'customer_name' => 'Customer 4',
            'total_price' => 50000,
            'status' => OrderStatus::PROCESS,
            'completed_at' => null,
        ]);

        $completedOrders = Order::todayCompleted()->get();

        $this->assertCount(1, $completedOrders);
        $this->assertTrue($completedOrders->contains('id', $order1->id));
        $this->assertFalse($completedOrders->contains('id', $order2->id));
        $this->assertFalse($completedOrders->contains('id', $order3->id));
        $this->assertFalse($completedOrders->contains('id', $order4->id));

        Carbon::setTestNow();
    }

    /**
     * Test OrderStatsService methods for completed today statistics.
     */
    public function test_order_stats_service_completed_today_counts(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // Outlet 1: 2 completed today orders
        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O1-1',
            'customer_name' => 'Customer O1-1',
            'total_price' => 45000,
            'status' => OrderStatus::DONE,
            'completed_at' => $now->copy()->subMinutes(20),
        ]);

        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O1-2',
            'customer_name' => 'Customer O1-2',
            'total_price' => 30000,
            'status' => OrderStatus::PICKED_UP,
            'completed_at' => $now->copy()->addMinutes(40),
        ]);

        // Outlet 2: 1 completed today order
        Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O2-1',
            'customer_name' => 'Customer O2-1',
            'total_price' => 15000,
            'status' => OrderStatus::DONE,
            'completed_at' => $now->copy()->addMinutes(35),
        ]);

        // Assert outlet specific service count
        $this->assertEquals(2, OrderStatsService::getCompletedTodayCountForOutlet($this->outlet1->id));
        $this->assertEquals(1, OrderStatsService::getCompletedTodayCountForOutlet($this->outlet2->id));

        Carbon::setTestNow();
    }

    /**
     * Test that different user roles receive the correct completed today dashboard metrics.
     */
    public function test_dashboard_completed_today_card_values_per_role(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // Outlet 1: 2 completed today orders
        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-1',
            'customer_name' => 'Cust 1',
            'total_price' => 20000,
            'status' => OrderStatus::DONE,
            'completed_at' => $now->copy()->subMinutes(15),
        ]);

        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-2',
            'customer_name' => 'Cust 2',
            'total_price' => 35000,
            'status' => OrderStatus::PICKED_UP,
            'completed_at' => $now->copy()->addMinutes(45),
        ]);

        // Outlet 2: 1 completed today order
        Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-3',
            'customer_name' => 'Cust 3',
            'total_price' => 25000,
            'status' => OrderStatus::DONE,
            'completed_at' => $now->copy()->subMinutes(30),
        ]);

        // 1. Super Admin: does not track completedToday in stats
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->missing('stats.completedToday')
            );

        // 2. Admin (restricted to Outlet 1): should be 2 completed today orders
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.completedToday', 2)
            );

        // 3. Cashier (restricted to Outlet 1): should be 2 completed today orders
        $this->actingAs($this->cashier)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.completedToday', 2)
            );

        // 4. Operator (restricted to Outlet 1): should be 2 completed today orders
        $this->actingAs($this->operator)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.completedToday', 2)
            );

        Carbon::setTestNow();
    }
}
