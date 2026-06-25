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

class DashboardRevenueSummaryCardTest extends TestCase
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
            'price' => 50000, // Rp50.000
            'unit' => 'kg',
        ]);

        $this->serviceItem2 = ServiceItem::create([
            'service_id' => $service2->id,
            'name' => 'Baju Kilat 2',
            'description' => 'Item 2',
            'time_number' => 1,
            'time_type' => ServiceTimeType::DAY->value,
            'price' => 30000, // Rp30.000
            'unit' => 'kg',
        ]);
    }

    /**
     * Test revenue summary statistics calculation and dashboard values for all roles.
     */
    public function test_dashboard_revenue_statistics_per_role(): void
    {
        // -------------------------------------------------------------
        // Step 1: June 30 - Orders created (Pending status)
        // -------------------------------------------------------------
        $this->travelTo(Carbon::parse('2026-06-30 12:00:00'));

        // Create Order 1 in Outlet 1 paid via CASH
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

        // Create Order 2 in Outlet 2 paid via QRIS
        // Acting as Super Admin to simulate creating an order or just keeping authenticated session for logging
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

        // Verify stats are Rp0 on June 30 because orders are PENDING, not DONE or PICKED_UP
        $this->assertEquals(0, OrderStatsService::getTodayRevenue());
        $this->assertEquals(0, OrderStatsService::getThisMonthRevenue());
        $this->assertEquals(0, OrderStatsService::getTodayRevenueForOutlet($this->outlet1->id));
        $this->assertEquals(0, OrderStatsService::getTodayRevenueForOutlet($this->outlet2->id));

        // -------------------------------------------------------------
        // Step 2: July 1 - Orders completed and new orders created
        // -------------------------------------------------------------
        $this->travelTo(Carbon::parse('2026-07-01 10:00:00'));

        $this->actingAs($this->cashier);
        OrderService::updateOrder(['status' => OrderStatus::DONE->value], $order1);

        $this->actingAs($this->superAdmin);
        OrderService::updateOrder(['status' => OrderStatus::DONE->value], $order2);

        // Create Order 3 in Outlet 1 on July 1 (CASH, completed today)
        $this->actingAs($this->cashier);
        $order3 = OrderService::createOrder([
            'outlet_id' => $this->outlet1->id,
            'customer_name' => 'Alice Cash',
            'payment_method' => PaymentMethod::CASH->value,
            'payment_amount' => 20000,
            'cart_items' => [
                [
                    'id' => $this->serviceItem1->id,
                    'qty' => 1, // Will be overridden or set by items? Wait, serviceItem1 price is 50,000, but let's just use serviceItem1 and adjust price expectation to 50,000!
                ],
            ],
        ]);
        // Wait! The OrderService::createOrder sumTotalPrice uses the resolved service item price.
        // ServiceItem1 price is 50,000. ServiceItem2 price is 30,000.
        // So let's make Order 3 have serviceItem1 (price 50,000) and Order 4 have serviceItem2 (price 30,000).
        // Let's check: Order 3: Outlet 1, CASH, price 50,000. Order 4: Outlet 1, QRIS, price 30,000.
        // Let's complete them.
        OrderService::updateOrder(['status' => OrderStatus::DONE->value], $order3);

        $order4 = OrderService::createOrder([
            'outlet_id' => $this->outlet1->id,
            'customer_name' => 'Bob Qris',
            'payment_method' => PaymentMethod::QRIS->value,
            'payment_amount' => 30000,
            'cart_items' => [
                [
                    'id' => $this->serviceItem2->id,
                    'qty' => 1,
                ],
            ],
        ]);
        OrderService::updateOrder(['status' => OrderStatus::DONE->value], $order4);

        // Verify stats on July 1:
        // Completed today globally: Order 1 (50,000) + Order 2 (30,000) + Order 3 (50,000) + Order 4 (30,000) = 160,000.
        // Created and completed today: Order 3 (50,000 CASH) and Order 4 (30,000 QRIS).
        $this->assertEquals(160000, OrderStatsService::getTodayRevenue());
        $this->assertEquals(160000, OrderStatsService::getThisMonthRevenue());

        // Outlet 1 revenue completed today: Order 1 (50,000) + Order 3 (50,000) + Order 4 (30,000) = 130,000.
        $this->assertEquals(130000, OrderStatsService::getTodayRevenueForOutlet($this->outlet1->id));
        // Outlet 2 revenue completed today: Order 2 (30,000) = 30,000.
        $this->assertEquals(30000, OrderStatsService::getTodayRevenueForOutlet($this->outlet2->id));

        // Payment methods on Outlet 1 (must be completed today to match todayCompleted() query)
        $this->assertEquals(100000, OrderStatsService::getTodayRevenueByPaymentMethodForOutlet($this->outlet1->id, PaymentMethod::CASH));
        $this->assertEquals(30000, OrderStatsService::getTodayRevenueByPaymentMethodForOutlet($this->outlet1->id, PaymentMethod::QRIS));

        // Payment methods on Outlet 2
        $this->assertEquals(0, OrderStatsService::getTodayRevenueByPaymentMethodForOutlet($this->outlet2->id, PaymentMethod::CASH));
        $this->assertEquals(30000, OrderStatsService::getTodayRevenueByPaymentMethodForOutlet($this->outlet2->id, PaymentMethod::QRIS));

        // 1. Super Admin: Sees revenue across all outlets
        $this->actingAs($this->superAdmin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.todayRevenueAllOutlets', 160000)
                ->where('stats.thisMonthRevenueAllOutlets', 160000)
            );

        // 2. Admin (restricted to Outlet 1)
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.todayRevenue', 130000)
                ->where('stats.monthRevenue', 80000)
            );

        // 3. Cashier (restricted to Outlet 1)
        $this->actingAs($this->cashier)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.todayRevenue', 130000)
                ->where('stats.cashRevenue', 100000)
                ->where('stats.qrisRevenue', 30000)
            );

        // 4. Operator (restricted to Outlet 1) - has no revenue cards
        $this->actingAs($this->operator)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->missing('stats.todayRevenue')
                ->missing('stats.monthRevenue')
                ->missing('stats.todayRevenueAllOutlets')
            );

        Carbon::setTestNow();
    }
}
