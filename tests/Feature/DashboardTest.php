<?php

use App\Enums\Order\OrderStatus;
use App\Enums\Outlet\OutletStatus;
use App\Enums\User\UserRole;
use App\Enums\User\UserStatus;
use App\Models\Order\Order;
use App\Models\Order\OrderStatusLog;
use App\Models\Outlet\Outlet;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('admin dashboard provides correct month chart props with data isolation', function () {
    // 1. Create two outlets
    $outlet1 = Outlet::factory()->create([
        'name' => 'Outlet 1',
        'status' => OutletStatus::ACTIVE,
    ]);

    $outlet2 = Outlet::factory()->create([
        'name' => 'Outlet 2',
        'status' => OutletStatus::ACTIVE,
    ]);

    // 2. Create Admin for Outlet 1
    $admin = User::create([
        'name' => 'Admin Outlet 1',
        'email' => 'admin_outlet1@test.com',
        'password' => bcrypt('password'),
        'role' => UserRole::ADMIN,
        'status' => UserStatus::ACTIVE,
        'outlet_id' => $outlet1->id,
    ]);

    // 3. Set standard date context (June 2026 has 30 days)
    Carbon::setTestNow('2026-06-22 10:00:00');

    // 4. Create an order in Outlet 1 that is completed
    $order1 = Order::forceCreate([
        'outlet_id' => $outlet1->id,
        'order_code' => 'ORD-1',
        'customer_name' => 'John',
        'total_price' => 150000,
        'status' => OrderStatus::DONE,
        'created_at' => '2026-06-20 12:00:00',
        'completed_at' => '2026-06-20 14:00:00',
    ]);

    // 5. Create an order in Outlet 2 (should not be counted for Outlet 1)
    $order2 = Order::forceCreate([
        'outlet_id' => $outlet2->id,
        'order_code' => 'ORD-2',
        'customer_name' => 'Jane',
        'total_price' => 200000,
        'status' => OrderStatus::DONE,
        'created_at' => '2026-06-20 12:00:00',
        'completed_at' => '2026-06-20 14:00:00',
    ]);

    // 6. Act as Admin of Outlet 1 and get Dashboard
    $this->actingAs($admin);
    $response = $this->get(route('dashboard'));

    $response->assertOk();

    // Verify Inertia props structure and data values
    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('dashboard')
            ->has('chartRevenueTrend')
            ->has('chartOrderMovement');

        $revenueTrend = $page->toArray()['props']['chartRevenueTrend'];
        $orderMovement = $page->toArray()['props']['chartOrderMovement'];

        expect($revenueTrend)->toBeArray()->toHaveCount(30)
            ->and($orderMovement)->toBeArray()->toHaveCount(30);

        // Find the index for June 20th (day 20 of June -> index 19)
        $day20Revenue = $revenueTrend[19];
        $day20Movement = $orderMovement[19];

        // Verify the date name
        expect($day20Revenue['name'])->toBe('20 Jun')
            ->and($day20Movement['name'])->toBe('20 Jun');

        // Verify the revenue trend is 150000 (from order1), not 350000
        expect($day20Revenue['grossRevenue'])->toBe(150000);

        // Verify incoming and completed counts:
        expect($day20Movement['order_masuk'])->toBe(1)
            ->and($day20Movement['order_selesai'])->toBe(1);
    });

    Carbon::setTestNow(); // Reset time mock
});

test('cashier dashboard provides correct today hourly and payment method charts with data isolation', function () {
    // 1. Create two outlets
    $outlet1 = Outlet::factory()->create([
        'name' => 'Outlet 1',
        'status' => OutletStatus::ACTIVE,
    ]);

    $outlet2 = Outlet::factory()->create([
        'name' => 'Outlet 2',
        'status' => OutletStatus::ACTIVE,
    ]);

    // 2. Create Cashier for Outlet 1
    $cashier = User::create([
        'name' => 'Cashier Outlet 1',
        'email' => 'cashier_outlet1@test.com',
        'password' => bcrypt('password'),
        'role' => UserRole::CASHIER,
        'status' => UserStatus::ACTIVE,
        'outlet_id' => $outlet1->id,
    ]);

    // 3. Set standard date context
    Carbon::setTestNow('2026-06-22 10:00:00');

    // 4. Create orders in Outlet 1
    // Order 1: Incoming today at 08:30:00 (not completed, pending)
    $order1 = Order::forceCreate([
        'outlet_id' => $outlet1->id,
        'order_code' => 'ORD-1',
        'customer_name' => 'John',
        'total_price' => 10000,
        'status' => OrderStatus::PENDING,
        'created_at' => '2026-06-22 08:30:00',
    ]);

    // Order 2: Completed today at 09:30:00, paid via CASH (status DONE)
    $order2 = Order::forceCreate([
        'outlet_id' => $outlet1->id,
        'order_code' => 'ORD-2',
        'customer_name' => 'Mary',
        'total_price' => 20000,
        'status' => OrderStatus::DONE,
        'created_at' => '2026-06-22 09:15:00',
        'completed_at' => '2026-06-22 09:30:00',
    ]);
    $order2->payment()->create([
        'method' => 'cash',
        'cash_payment_amount' => 20000,
        'cash_change_amount' => 0,
    ]);

    // Order 3: Completed today at 09:45:00, paid via QRIS (status PICKED_UP)
    $order3 = Order::forceCreate([
        'outlet_id' => $outlet1->id,
        'order_code' => 'ORD-3',
        'customer_name' => 'Bob',
        'total_price' => 30000,
        'status' => OrderStatus::PICKED_UP,
        'created_at' => '2026-06-22 09:20:00',
        'completed_at' => '2026-06-22 09:45:00',
    ]);
    $order3->payment()->create([
        'method' => 'qris',
    ]);

    // Order 4: Cancelled order today at 09:00:00 (should not be counted in hourly order list)
    $order4 = Order::forceCreate([
        'outlet_id' => $outlet1->id,
        'order_code' => 'ORD-4',
        'customer_name' => 'David',
        'total_price' => 40000,
        'status' => OrderStatus::CANCELLED,
        'created_at' => '2026-06-22 09:00:00',
    ]);

    // Order 5: Order in Outlet 2 (should not be counted for Outlet 1)
    $order5 = Order::forceCreate([
        'outlet_id' => $outlet2->id,
        'order_code' => 'ORD-5',
        'customer_name' => 'Jane',
        'total_price' => 15000,
        'status' => OrderStatus::DONE,
        'created_at' => '2026-06-22 09:10:00',
        'completed_at' => '2026-06-22 09:25:00',
    ]);
    $order5->payment()->create([
        'method' => 'cash',
        'cash_payment_amount' => 15000,
        'cash_change_amount' => 0,
    ]);

    // 5. Act as Cashier of Outlet 1 and get Dashboard
    $this->actingAs($cashier);
    $response = $this->get(route('dashboard'));

    $response->assertOk();

    // Verify Inertia props structure and data values
    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('dashboard')
            ->has('chartTodayHourlyOrders')
            ->has('chartTodayPaymentMethods');

        $hourly = $page->toArray()['props']['chartTodayHourlyOrders'];
        $payments = $page->toArray()['props']['chartTodayPaymentMethods'];

        expect($hourly)->toBeArray()->toHaveCount(24)
            ->and($payments)->toBeArray()->toHaveCount(2);

        // Hour 08:00 (index 8) should have count 1 (order1)
        expect($hourly[8]['hour'])->toBe('08:00')
            ->and($hourly[8]['count'])->toBe(1);

        // Hour 09:00 (index 9) should have count 2 (order2, order3 - order4 is cancelled, order5 is other outlet)
        expect($hourly[9]['hour'])->toBe('09:00')
            ->and($hourly[9]['count'])->toBe(2);

        // Payment Cash should be 1, QRIS should be 1 (excluding outlet2)
        expect($payments[0]['label']['value'])->toBe('cash')
            ->and($payments[0]['value'])->toBe(1)
            ->and($payments[1]['label']['value'])->toBe('qris')
            ->and($payments[1]['value'])->toBe(1);
    });

    Carbon::setTestNow(); // Reset time mock
});

test('operator dashboard provides correct today hourly processed vs completed chart with data isolation', function () {
    // 1. Create two outlets
    $outlet1 = Outlet::factory()->create([
        'name' => 'Outlet 1',
        'status' => OutletStatus::ACTIVE,
    ]);

    $outlet2 = Outlet::factory()->create([
        'name' => 'Outlet 2',
        'status' => OutletStatus::ACTIVE,
    ]);

    // 2. Create Operator for Outlet 1
    $operator = User::create([
        'name' => 'Operator Outlet 1',
        'email' => 'operator_outlet1@test.com',
        'password' => bcrypt('password'),
        'role' => UserRole::OPERATOR,
        'status' => UserStatus::ACTIVE,
        'outlet_id' => $outlet1->id,
    ]);

    // 3. Set standard date context
    Carbon::setTestNow('2026-06-22 10:00:00');

    // 4. Create orders in Outlet 1
    // Order 1: Processed today at 08:30:00 (via status log)
    $order1 = Order::forceCreate([
        'outlet_id' => $outlet1->id,
        'order_code' => 'ORD-1',
        'customer_name' => 'John',
        'total_price' => 10000,
        'status' => OrderStatus::PROCESS,
        'created_at' => '2026-06-22 08:00:00',
    ]);
    // Log PROCESS status change at 08:30:00
    OrderStatusLog::forceCreate([
        'order_id' => $order1->id,
        'user_id' => $operator->id,
        'from_status' => OrderStatus::PENDING,
        'to_status' => OrderStatus::PROCESS,
        'created_at' => '2026-06-22 08:30:00',
    ]);

    // Order 2: Completed today at 09:30:00 (via completed_at on order)
    $order2 = Order::forceCreate([
        'outlet_id' => $outlet1->id,
        'order_code' => 'ORD-2',
        'customer_name' => 'Mary',
        'total_price' => 20000,
        'status' => OrderStatus::DONE,
        'created_at' => '2026-06-22 08:00:00',
        'completed_at' => '2026-06-22 09:30:00',
    ]);
    // Log PROCESS status change at 09:10:00
    OrderStatusLog::forceCreate([
        'order_id' => $order2->id,
        'user_id' => $operator->id,
        'from_status' => OrderStatus::PENDING,
        'to_status' => OrderStatus::PROCESS,
        'created_at' => '2026-06-22 09:10:00',
    ]);

    // Order 3: Order in Outlet 2 (should not be counted for Outlet 1)
    $order3 = Order::forceCreate([
        'outlet_id' => $outlet2->id,
        'order_code' => 'ORD-3',
        'customer_name' => 'Jane',
        'total_price' => 15000,
        'status' => OrderStatus::DONE,
        'created_at' => '2026-06-22 08:00:00',
        'completed_at' => '2026-06-22 09:25:00',
    ]);
    OrderStatusLog::forceCreate([
        'order_id' => $order3->id,
        'user_id' => $operator->id,
        'from_status' => OrderStatus::PENDING,
        'to_status' => OrderStatus::PROCESS,
        'created_at' => '2026-06-22 09:10:00',
    ]);

    // 5. Act as Operator of Outlet 1 and get Dashboard
    $this->actingAs($operator);
    $response = $this->get(route('dashboard'));

    $response->assertOk();

    // Verify Inertia props structure and data values
    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('dashboard')
            ->has('chartTodayHourlyProcessedVsCompleted');

        $hourly = $page->toArray()['props']['chartTodayHourlyProcessedVsCompleted'];

        expect($hourly)->toBeArray()->toHaveCount(24);

        // Hour 08:00 (index 8) should have diproses 1, selesai 0 (order1 processed at 08:30)
        expect($hourly[8]['hour'])->toBe('08:00')
            ->and($hourly[8]['diproses'])->toBe(1)
            ->and($hourly[8]['selesai'])->toBe(0);

        // Hour 09:00 (index 9) should have diproses 1 (order2 processed at 09:10), selesai 1 (order2 completed at 09:30)
        // (order3 processed at 09:10 and completed at 09:25 is other outlet)
        expect($hourly[9]['hour'])->toBe('09:00')
            ->and($hourly[9]['diproses'])->toBe(1)
            ->and($hourly[9]['selesai'])->toBe(1);
    });

    Carbon::setTestNow(); // Reset time mock
});
