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

class DashboardAlmostOverdueSummaryCardTest extends TestCase
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
     * Test scopeAlmostOverdue filters orders correctly based on status and estimated completion time.
     */
    public function test_scope_almost_overdue_filters_correctly(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // Almost Overdue: status in [OrderStatus::PENDING, OrderStatus::PROCESS], estimated_completed_at between now and now + 60 minutes

        // 1. Pending order due in 30 minutes (Almost Overdue)
        $order1 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-001',
            'customer_name' => 'Customer 1',
            'total_price' => 50000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->addMinutes(30),
        ]);

        // 2. Process order due in 59 minutes (Almost Overdue)
        $order2 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-002',
            'customer_name' => 'Customer 2',
            'total_price' => 50000,
            'status' => OrderStatus::PROCESS,
            'estimated_completed_at' => $now->copy()->addMinutes(59),
        ]);

        // 3. Pending order due in 61 minutes (NOT Almost Overdue - too far)
        $order3 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-003',
            'customer_name' => 'Customer 3',
            'total_price' => 50000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->addMinutes(61),
        ]);

        // 4. Pending order due 10 minutes ago (NOT Almost Overdue - it is Overdue)
        $order4 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-004',
            'customer_name' => 'Customer 4',
            'total_price' => 50000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->subMinutes(10),
        ]);

        // 5. Done order due in 30 minutes (NOT Almost Overdue - already Done)
        $order5 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-005',
            'customer_name' => 'Customer 5',
            'total_price' => 50000,
            'status' => OrderStatus::DONE,
            'estimated_completed_at' => $now->copy()->addMinutes(30),
        ]);

        // 6. Pending order with null estimated_completed_at (NOT Almost Overdue)
        $order6 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-006',
            'customer_name' => 'Customer 6',
            'total_price' => 50000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => null,
        ]);

        $almostOverdueOrders = Order::almostOverdue()->get();

        $this->assertCount(2, $almostOverdueOrders);
        $this->assertTrue($almostOverdueOrders->contains('id', $order1->id));
        $this->assertTrue($almostOverdueOrders->contains('id', $order2->id));
        $this->assertFalse($almostOverdueOrders->contains('id', $order3->id));
        $this->assertFalse($almostOverdueOrders->contains('id', $order4->id));
        $this->assertFalse($almostOverdueOrders->contains('id', $order5->id));
        $this->assertFalse($almostOverdueOrders->contains('id', $order6->id));

        Carbon::setTestNow();
    }

    /**
     * Test OrderStatsService methods for almost overdue statistics.
     */
    public function test_order_stats_service_almost_overdue_counts(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // Outlet 1: 2 almost overdue orders
        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O1-1',
            'customer_name' => 'Customer O1-1',
            'total_price' => 45000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->addMinutes(20),
        ]);

        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O1-2',
            'customer_name' => 'Customer O1-2',
            'total_price' => 30000,
            'status' => OrderStatus::PROCESS,
            'estimated_completed_at' => $now->copy()->addMinutes(40),
        ]);

        // Outlet 2: 1 almost overdue order
        Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->cashier->id, // just use same cashier as it is not restricted to outlet
            'order_code' => 'ORD-O2-1',
            'customer_name' => 'Customer O2-1',
            'total_price' => 15000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->addMinutes(35),
        ]);

        // Assert global service count
        $this->assertEquals(3, OrderStatsService::getAlmostOverdueCount());

        // Assert outlet specific service count
        $this->assertEquals(2, OrderStatsService::getAlmostOverdueCountForOutlet($this->outlet1->id));
        $this->assertEquals(1, OrderStatsService::getAlmostOverdueCountForOutlet($this->outlet2->id));

        Carbon::setTestNow();
    }

    /**
     * Test that different user roles receive the correct almost overdue dashboard metrics.
     */
    public function test_dashboard_almost_overdue_card_values_per_role(): void
    {
        $now = Carbon::parse('2026-06-30 12:00:00');
        Carbon::setTestNow($now);

        // Outlet 1: 2 almost overdue orders
        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-1',
            'customer_name' => 'Cust 1',
            'total_price' => 20000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->addMinutes(15),
        ]);

        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-2',
            'customer_name' => 'Cust 2',
            'total_price' => 35000,
            'status' => OrderStatus::PROCESS,
            'estimated_completed_at' => $now->copy()->addMinutes(45),
        ]);

        // Outlet 2: 1 almost overdue order
        Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-3',
            'customer_name' => 'Cust 3',
            'total_price' => 25000,
            'status' => OrderStatus::PENDING,
            'estimated_completed_at' => $now->copy()->addMinutes(30),
        ]);

        // 1. Super Admin: sees all outlets (should be 3 almost overdue orders)
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.almostOverdueOrdersAllOutlets', 3)
            );

        // 2. Admin (restricted to Outlet 1): should be 2 almost overdue orders
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.almostOverdueOrders', 2)
            );

        // 3. Operator (restricted to Outlet 1): should be 2 almost overdue orders
        $this->actingAs($this->operator)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.almostOverdueOrders', 2)
            );

        // 4. Cashier: Cashier dashboard does not track/render almost overdue orders
        $this->actingAs($this->cashier)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->missing('stats.almostOverdueOrders')
                ->missing('stats.almostOverdueOrdersAllOutlets')
            );

        Carbon::setTestNow();
    }
}
