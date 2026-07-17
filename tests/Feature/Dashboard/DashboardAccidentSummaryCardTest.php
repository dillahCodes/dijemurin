<?php

namespace Tests\Feature\Dashboard;

use App\Enums\Accident\AccidentStatus;
use App\Enums\Accident\AccidentType;
use App\Enums\Order\OrderStatus;
use App\Enums\Outlet\OutletStatus;
use App\Enums\Service\ServiceTimeType;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\Accident\Accident;
use App\Models\Accident\AccidentItem;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Models\Outlet\Outlet;
use App\Models\Service\Service;
use App\Models\Service\ServiceItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardAccidentSummaryCardTest extends TestCase
{
    use RefreshDatabase;

    private Outlet $outlet1;

    private Outlet $outlet2;

    private User $superAdmin;

    private User $admin;

    private User $cashier;

    private User $operator;

    private OrderItem $orderItem1;

    private OrderItem $orderItem2;

    private OrderItem $orderItem3;

    private OrderItem $orderItem4;

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

        // Setup mock service and items to satisfy any DB constraints
        $service1 = Service::create([
            'outlet_id' => $this->outlet1->id,
            'name' => 'Cuci Kilat Outlet 1',
            'description' => 'Service 1',
        ]);

        $serviceItem1 = ServiceItem::create([
            'service_id' => $service1->id,
            'name' => 'Baju Kilat',
            'description' => 'Item 1',
            'time_number' => 1,
            'time_type' => ServiceTimeType::DAY->value,
            'price' => 50000,
            'unit' => 'kg',
        ]);

        // Create mock orders
        $order1 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-1',
            'customer_name' => 'John Doe',
            'total_price' => 50000,
            'status' => OrderStatus::PROCESS,
        ]);

        $this->orderItem1 = OrderItem::create([
            'order_id' => $order1->id,
            'service_item_id' => $serviceItem1->id,
            'item_name' => 'Kemeja Biru',
            'item_price' => 50000,
            'unit' => 'pcs',
            'quantity' => 1,
            'subtotal' => 50000,
        ]);

        $order2 = Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->superAdmin->id,
            'order_code' => 'ORD-2',
            'customer_name' => 'Jane Smith',
            'total_price' => 50000,
            'status' => OrderStatus::PROCESS,
        ]);

        $this->orderItem2 = OrderItem::create([
            'order_id' => $order2->id,
            'service_item_id' => $serviceItem1->id,
            'item_name' => 'Kemeja Merah',
            'item_price' => 50000,
            'unit' => 'pcs',
            'quantity' => 1,
            'subtotal' => 50000,
        ]);

        $order3 = Order::create([
            'outlet_id' => $this->outlet1->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-3',
            'customer_name' => 'Bob Doe',
            'total_price' => 50000,
            'status' => OrderStatus::PROCESS,
        ]);

        $this->orderItem3 = OrderItem::create([
            'order_id' => $order3->id,
            'service_item_id' => $serviceItem1->id,
            'item_name' => 'Kemeja Hijau',
            'item_price' => 50000,
            'unit' => 'pcs',
            'quantity' => 1,
            'subtotal' => 50000,
        ]);

        $order4 = Order::create([
            'outlet_id' => $this->outlet2->id,
            'cashier_id' => $this->superAdmin->id,
            'order_code' => 'ORD-4',
            'customer_name' => 'Alice Smith',
            'total_price' => 50000,
            'status' => OrderStatus::PROCESS,
        ]);

        $this->orderItem4 = OrderItem::create([
            'order_id' => $order4->id,
            'service_item_id' => $serviceItem1->id,
            'item_name' => 'Kemeja Putih',
            'item_price' => 50000,
            'unit' => 'pcs',
            'quantity' => 1,
            'subtotal' => 50000,
        ]);
    }

    /**
     * Test accident stats returned to Super Admin dashboard
     */
    public function test_super_admin_accident_stats(): void
    {
        // 1. Create a pending accident in Outlet 1
        $accident1 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem1->order_id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::PENDING,
        ]);
        AccidentItem::create([
            'accident_id' => $accident1->id,
            'order_item_id' => $this->orderItem1->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Sobek',
        ]);

        // 2. Create an investigating accident in Outlet 2
        $accident2 = Accident::create([
            'outlet_id' => $this->outlet2->id,
            'order_id' => $this->orderItem2->order_id,
            'reporter_id' => $this->superAdmin->id,
            'status' => AccidentStatus::INVESTIGATING,
        ]);
        AccidentItem::create([
            'accident_id' => $accident2->id,
            'order_item_id' => $this->orderItem2->id,
            'type' => AccidentType::LOST_ITEM,
            'description' => 'Hilang',
        ]);

        // 3. Create a resolved accident in Outlet 1 resolved THIS month with compensation amount 100000
        $accident3 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem3->order_id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::RESOLVED,
            'resolved_at' => now(),
        ]);
        AccidentItem::create([
            'accident_id' => $accident3->id,
            'order_item_id' => $this->orderItem3->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Rusak',
            'compensation_amount' => 100000,
        ]);

        // 4. Create a resolved accident in Outlet 2 resolved LAST month with compensation amount 150000
        $accident4 = Accident::create([
            'outlet_id' => $this->outlet2->id,
            'order_id' => $this->orderItem4->order_id,
            'reporter_id' => $this->superAdmin->id,
            'status' => AccidentStatus::RESOLVED,
            'resolved_at' => now()->subMonth(),
        ]);
        AccidentItem::create([
            'accident_id' => $accident4->id,
            'order_item_id' => $this->orderItem4->id,
            'type' => AccidentType::COLOR_BLED,
            'description' => 'Luntur',
            'compensation_amount' => 150000,
        ]);

        // Act as Super Admin
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.activeAccidentsAllOutlets', 2) // accident1 + accident2
                ->where('stats.resolvedAccidentsThisMonthAllOutlets', 1) // only accident3
                ->where('stats.resolvedAccidentLossThisMonthAllOutlets', 100000) // only accident3
            );
    }

    /**
     * Test accident stats returned to Admin dashboard with data isolation
     */
    public function test_admin_accident_stats_with_data_isolation(): void
    {
        // 1. Create active accident in Outlet 1
        $accident1 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem1->order_id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::PENDING,
        ]);
        AccidentItem::create([
            'accident_id' => $accident1->id,
            'order_item_id' => $this->orderItem1->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Sobek',
        ]);

        // 2. Create active accident in Outlet 2 (should not be counted for Outlet 1)
        $accident2 = Accident::create([
            'outlet_id' => $this->outlet2->id,
            'order_id' => $this->orderItem2->order_id,
            'reporter_id' => $this->superAdmin->id,
            'status' => AccidentStatus::INVESTIGATING,
        ]);
        AccidentItem::create([
            'accident_id' => $accident2->id,
            'order_item_id' => $this->orderItem2->id,
            'type' => AccidentType::LOST_ITEM,
            'description' => 'Hilang',
        ]);

        // 3. Create a resolved accident in Outlet 1 resolved THIS month with compensation amount 100000
        $accident3 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem3->order_id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::RESOLVED,
            'resolved_at' => now(),
        ]);
        AccidentItem::create([
            'accident_id' => $accident3->id,
            'order_item_id' => $this->orderItem3->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Rusak',
            'compensation_amount' => 100000,
        ]);

        // 4. Create a resolved accident in Outlet 1 resolved LAST month with compensation amount 150000 (should not be counted this month)
        $accident4 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem4->order_id,
            'reporter_id' => $this->superAdmin->id,
            'status' => AccidentStatus::RESOLVED,
            'resolved_at' => now()->subMonth(),
        ]);
        AccidentItem::create([
            'accident_id' => $accident4->id,
            'order_item_id' => $this->orderItem4->id,
            'type' => AccidentType::COLOR_BLED,
            'description' => 'Luntur',
            'compensation_amount' => 150000,
        ]);

        // Act as Admin of Outlet 1
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.activeAccidents', 1) // accident1 (outlet 1)
                ->where('stats.resolvedAccidentsThisMonth', 1) // accident3 (outlet 1)
                ->where('stats.resolvedAccidentLossThisMonth', 100000) // accident3 (outlet 1)
            );
    }

    /**
     * Test accident stats returned to Cashier and Operator dashboards
     */
    public function test_cashier_and_operator_accident_stats(): void
    {
        // 1. Create active accident in Outlet 1 reported by current Cashier
        $accident1 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem1->order_id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::PENDING,
        ]);
        AccidentItem::create([
            'accident_id' => $accident1->id,
            'order_item_id' => $this->orderItem1->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Sobek',
        ]);

        // 2. Create active accident in Outlet 1 reported by Operator
        $accident2 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem2->order_id,
            'reporter_id' => $this->operator->id,
            'status' => AccidentStatus::INVESTIGATING,
        ]);
        AccidentItem::create([
            'accident_id' => $accident2->id,
            'order_item_id' => $this->orderItem2->id,
            'type' => AccidentType::LOST_ITEM,
            'description' => 'Hilang',
        ]);

        // 3. Create resolved accident in Outlet 1 reported by current Cashier resolved THIS month
        $accident3 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem3->order_id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::RESOLVED,
            'resolved_at' => now(),
        ]);
        AccidentItem::create([
            'accident_id' => $accident3->id,
            'order_item_id' => $this->orderItem3->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Rusak',
            'compensation_amount' => 100000,
        ]);

        // Act as Cashier of Outlet 1
        $this->actingAs($this->cashier)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.activeAccidents', 2) // accident1 (pending) + accident2 (investigating)
                ->where('stats.myReportedAccidents', 2) // accident1 + accident3 reported by Cashier
                ->where('stats.resolvedAccidentsThisMonth', 1) // accident3 resolved this month
            );

        // Act as Operator of Outlet 1
        $this->actingAs($this->operator)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.activeAccidents', 2)
                ->where('stats.myReportedAccidents', 1) // accident2 reported by Operator
                ->where('stats.resolvedAccidentsThisMonth', 1)
            );
    }

    /**
     * Test accident index filtering by reporterId
     */
    public function test_accident_index_filter_by_reporter(): void
    {
        // 1. Create accident reported by Cashier
        $accident1 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem1->order_id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::PENDING,
        ]);
        AccidentItem::create([
            'accident_id' => $accident1->id,
            'order_item_id' => $this->orderItem1->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Sobek',
        ]);

        // 2. Create accident reported by Operator
        $accident2 = Accident::create([
            'outlet_id' => $this->outlet1->id,
            'order_id' => $this->orderItem2->order_id,
            'reporter_id' => $this->operator->id,
            'status' => AccidentStatus::PENDING,
        ]);
        AccidentItem::create([
            'accident_id' => $accident2->id,
            'order_item_id' => $this->orderItem2->id,
            'type' => AccidentType::LOST_ITEM,
            'description' => 'Hilang',
        ]);

        // Act as Cashier and get accidents with reporterId filter matching Cashier
        $this->actingAs($this->cashier)
            ->get(route('accidents.index', ['reporterId' => $this->cashier->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('accident/index')
                ->has('accidents.data', 1)
                ->where('accidents.data.0.reporter_id', $this->cashier->id)
            );

        // Act as Cashier and get accidents without reporterId filter (should show both)
        $this->actingAs($this->cashier)
            ->get(route('accidents.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('accident/index')
                ->has('accidents.data', 2)
            );
    }
}
