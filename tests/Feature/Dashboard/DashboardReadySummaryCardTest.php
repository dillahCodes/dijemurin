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
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardReadySummaryCardTest extends TestCase
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
     * Test scopeDone filters orders correctly based on status.
     */
    public function test_scope_done_filters_correctly(): void
    {
        // 1. Order with status DONE (Included)
        $order1 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-001',
            'customer_name' => 'Customer 1',
            'total_price' => 50000,
            'status' => OrderStatus::DONE,
        ]);

        // 2. Order with status PENDING (Excluded)
        $order2 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-002',
            'customer_name' => 'Customer 2',
            'total_price' => 50000,
            'status' => OrderStatus::PENDING,
        ]);

        // 3. Order with status PROCESS (Excluded)
        $order3 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-003',
            'customer_name' => 'Customer 3',
            'total_price' => 50000,
            'status' => OrderStatus::PROCESS,
        ]);

        // 4. Order with status PICKED_UP (Excluded)
        $order4 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-004',
            'customer_name' => 'Customer 4',
            'total_price' => 50000,
            'status' => OrderStatus::PICKED_UP,
        ]);

        // 5. Order with status CANCELLED (Excluded)
        $order5 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-005',
            'customer_name' => 'Customer 5',
            'total_price' => 50000,
            'status' => OrderStatus::CANCELLED,
        ]);

        $doneOrders = Order::done()->get();

        $this->assertCount(1, $doneOrders);
        $this->assertTrue($doneOrders->contains('id', $order1->id));
        $this->assertFalse($doneOrders->contains('id', $order2->id));
        $this->assertFalse($doneOrders->contains('id', $order3->id));
        $this->assertFalse($doneOrders->contains('id', $order4->id));
        $this->assertFalse($doneOrders->contains('id', $order5->id));
    }

    /**
     * Test OrderStatsService methods for done / ready statistics.
     */
    public function test_order_stats_service_done_counts(): void
    {
        // Outlet 1: 2 done orders
        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O1-1',
            'customer_name' => 'Customer O1-1',
            'total_price' => 45000,
            'status' => OrderStatus::DONE,
        ]);

        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O1-2',
            'customer_name' => 'Customer O1-2',
            'total_price' => 30000,
            'status' => OrderStatus::DONE,
        ]);

        // Outlet 2: 1 done order
        Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-O2-1',
            'customer_name' => 'Customer O2-1',
            'total_price' => 15000,
            'status' => OrderStatus::DONE,
        ]);

        // Assert global done count
        $this->assertEquals(3, OrderStatsService::getDoneOrderCount());

        // Assert outlet specific done count
        $this->assertEquals(2, OrderStatsService::getDoneOrderCountForOutlet($this->outlet1->id));
        $this->assertEquals(1, OrderStatsService::getDoneOrderCountForOutlet($this->outlet2->id));
    }

    /**
     * Test that different user roles receive the correct ready orders dashboard metrics.
     */
    public function test_dashboard_ready_card_values_per_role(): void
    {
        // Outlet 1: 2 done orders
        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-1',
            'customer_name' => 'Cust 1',
            'total_price' => 20000,
            'status' => OrderStatus::DONE,
        ]);

        Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-2',
            'customer_name' => 'Cust 2',
            'total_price' => 35000,
            'status' => OrderStatus::DONE,
        ]);

        // Outlet 2: 1 done order
        Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-3',
            'customer_name' => 'Cust 3',
            'total_price' => 25000,
            'status' => OrderStatus::DONE,
        ]);

        // 1. Super Admin: sees all outlets (readyOrdersAllOutlets = 3)
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.readyOrdersAllOutlets', 3)
                ->missing('stats.readyOrders')
            );

        // 2. Admin (restricted to Outlet 1): readyOrders = 2
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.readyOrders', 2)
                ->missing('stats.readyOrdersAllOutlets')
            );

        // 3. Cashier (restricted to Outlet 1): readyOrders = 2
        $this->actingAs($this->cashier)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.readyOrders', 2)
                ->missing('stats.readyOrdersAllOutlets')
            );

        // 4. Operator (restricted to Outlet 1): readyOrders = 2
        $this->actingAs($this->operator)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.readyOrders', 2)
                ->missing('stats.readyOrdersAllOutlets')
            );
    }
}
