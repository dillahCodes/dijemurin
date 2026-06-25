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

class DashboardOverdueSummaryCardTest extends TestCase
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
     * Test scopeOverdue filters orders correctly based on status and estimated completion time.
     */
    public function test_scope_overdue_filters_correctly(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // Overdue: status in [OrderStatus::PENDING, OrderStatus::PROCESS], estimated_completed_at is not null and in the past (< now)

        // 1. Pending order due 1 minute ago (Overdue)
        $order1 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-001',
            'customer_name' => 'Customer 1',
            'total_price' => 50000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->subMinute(),
        ]);

        // 2. Process order due 2 hours ago (Overdue)
        $order2 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-002',
            'customer_name' => 'Customer 2',
            'total_price' => 50000,
            'status' => OrderStatus::PROCESS,
            'estimated_completed_at' => $now->copy()->subHours(2),
        ]);

        // 3. Pending order due in 1 minute (NOT Overdue - it is in the future, thus Almost Overdue)
        $order3 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-003',
            'customer_name' => 'Customer 3',
            'total_price' => 50000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->addMinute(),
        ]);

        // 4. Done order due 1 hour ago (NOT Overdue - it is completed)
        $order4 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-004',
            'customer_name' => 'Customer 4',
            'total_price' => 50000,
            'status' => OrderStatus::DONE,
            'estimated_completed_at' => $now->copy()->subHour(),
        ]);

        // 5. Pending order with null estimated_completed_at (NOT Overdue)
        $order5 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-005',
            'customer_name' => 'Customer 5',
            'total_price' => 50000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => null,
        ]);

        $overdueOrders = Order::overdue()->get();

        $this->assertCount(2, $overdueOrders);
        $this->assertTrue($overdueOrders->contains('id', $order1->id));
        $this->assertTrue($overdueOrders->contains('id', $order2->id));
        $this->assertFalse($overdueOrders->contains('id', $order3->id));
        $this->assertFalse($overdueOrders->contains('id', $order4->id));
        $this->assertFalse($overdueOrders->contains('id', $order5->id));

        Carbon::setTestNow();
    }

    /**
     * Test OrderStatsService methods for overdue statistics.
     */
    public function test_order_stats_service_overdue_counts(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // Outlet 1: 2 overdue orders
        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O1-1',
            'customer_name' => 'Customer O1-1',
            'total_price' => 45000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->subMinutes(20),
        ]);

        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O1-2',
            'customer_name' => 'Customer O1-2',
            'total_price' => 30000,
            'status' => OrderStatus::PROCESS,
            'estimated_completed_at' => $now->copy()->subMinutes(40),
        ]);

        // Outlet 2: 1 overdue order
        Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O2-1',
            'customer_name' => 'Customer O2-1',
            'total_price' => 15000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->subMinutes(35),
        ]);

        // Assert global service count
        $this->assertEquals(3, OrderStatsService::getOverdueCount());

        // Assert outlet specific service count
        $this->assertEquals(2, OrderStatsService::getOverdueCountForOutlet($this->outlet1->id));
        $this->assertEquals(1, OrderStatsService::getOverdueCountForOutlet($this->outlet2->id));

        Carbon::setTestNow();
    }

    /**
     * Test that different user roles receive the correct overdue dashboard metrics.
     */
    public function test_dashboard_overdue_card_values_per_role(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // Outlet 1: 2 overdue orders
        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-1',
            'customer_name' => 'Cust 1',
            'total_price' => 20000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->subMinutes(15),
        ]);

        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-2',
            'customer_name' => 'Cust 2',
            'total_price' => 35000,
            'status' => OrderStatus::PROCESS,
            'estimated_completed_at' => $now->copy()->subMinutes(45),
        ]);

        // Outlet 2: 1 overdue order
        Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-3',
            'customer_name' => 'Cust 3',
            'total_price' => 25000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->subMinutes(30),
        ]);

        // 1. Super Admin: sees all outlets (should be 3 overdue orders)
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.overdueOrdersAllOutlets', 3)
            );

        // 2. Admin (restricted to Outlet 1): should be 2 overdue orders
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.overdueOrders', 2)
            );

        // 3. Cashier (restricted to Outlet 1): should be 2 overdue orders
        $this->actingAs($this->cashier)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.overdueOrders', 2)
            );

        // 4. Operator (restricted to Outlet 1): should be 2 overdue orders
        $this->actingAs($this->operator)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.overdueOrders', 2)
            );

        Carbon::setTestNow();
    }
}
