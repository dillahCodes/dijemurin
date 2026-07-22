<?php

namespace Tests\Feature\Accident;

use App\Enums\Accident\AccidentCompensationType;
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
use Tests\TestCase;

class AccidentTest extends TestCase
{
    use RefreshDatabase;

    private Outlet $outlet;

    private Outlet $anotherOutlet;

    private User $superAdmin;

    private User $admin;

    private User $cashier;

    private User $anotherCashier;

    private Order $order;

    private OrderItem $orderItem;

    protected function setUp(): void
    {
        parent::setUp();

        $this->outlet = Outlet::create([
            'name' => 'Test Outlet',
            'address' => 'Test Address 1',
            'phone' => '08123456789',
            'status' => OutletStatus::ACTIVE,
        ]);

        $service = Service::create([
            'outlet_id' => $this->outlet->id,
            'name' => 'Cuci Kering',
            'description' => 'Test Service Description',
        ]);

        $serviceItem = ServiceItem::create([
            'service_id' => $service->id,
            'name' => 'Baju Satuan',
            'description' => 'Test Service Item Description',
            'time_number' => 2,
            'time_type' => ServiceTimeType::DAY->value,
            'price' => 5000,
            'unit' => 'pcs',
        ]);

        $this->anotherOutlet = Outlet::create([
            'name' => 'Another Outlet',
            'address' => 'Test Address 2',
            'phone' => '08123456790',
            'status' => OutletStatus::ACTIVE,
        ]);

        $this->superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::SUPER_ADMIN,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->admin = User::create([
            'name' => 'Admin Outlet 1',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::ADMIN,
            'status' => UserStatus::ACTIVE,
            'outlet_id' => $this->outlet->id,
        ]);

        $this->cashier = User::create([
            'name' => 'Staf Pelapor',
            'email' => 'cashier@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::CASHIER,
            'status' => UserStatus::ACTIVE,
            'outlet_id' => $this->outlet->id,
        ]);

        $this->anotherCashier = User::create([
            'name' => 'Kasir Lain',
            'email' => 'another_cashier@test.com',
            'password' => bcrypt('password'),
            'role' => UserRole::CASHIER,
            'status' => UserStatus::ACTIVE,
            'outlet_id' => $this->outlet->id,
        ]);

        $this->order = Order::create([
            'outlet_id' => $this->outlet->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-TEST-123',
            'customer_name' => 'Jane Doe',
            'total_price' => 15000,
            'status' => OrderStatus::PROCESS,
        ]);

        $this->orderItem = OrderItem::create([
            'order_id' => $this->order->id,
            'service_item_id' => $serviceItem->id,
            'item_name' => 'Kemeja Biru',
            'item_price' => 5000,
            'unit' => 'pcs',
            'quantity' => 1,
            'subtotal' => 5000,
        ]);
    }

    /**
     * Helper: payload dasar untuk store dengan satu item.
     */
    private function baseStorePayload(array $override = []): array
    {
        return array_merge([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'description' => null,
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'item_details' => 'Kemeja Biru robek',
                    'description' => 'Sobek di lengan kanan saat dicuci',
                ],
            ],
        ], $override);
    }

    public function test_super_admin_can_report_accident_with_custom_outlet(): void
    {
        $this->actingAs($this->superAdmin);

        $anotherOrder = Order::create([
            'outlet_id' => $this->anotherOutlet->id,
            'cashier_id' => $this->superAdmin->id,
            'order_code' => 'ORD-TEST-ANOTHER',
            'customer_name' => 'John Doe',
            'total_price' => 10000,
            'status' => OrderStatus::PROCESS,
        ]);

        $anotherOrderItem = OrderItem::create([
            'order_id' => $anotherOrder->id,
            'service_item_id' => $this->orderItem->service_item_id,
            'item_name' => 'Kemeja Merah',
            'item_price' => 5000,
            'unit' => 'pcs',
            'quantity' => 1,
            'subtotal' => 5000,
        ]);

        $response = $this->post(route('accidents.store'), [
            'outlet_id' => $this->anotherOutlet->id,
            'order_id' => $anotherOrder->id,
            'items' => [
                [
                    'order_item_id' => $anotherOrderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'item_details' => 'Kemeja Merah',
                    'description' => 'Sobek karena mesin pengering',
                ],
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('accidents', [
            'outlet_id' => $this->anotherOutlet->id,
            'reporter_id' => $this->superAdmin->id,
        ]);
        $this->assertDatabaseHas('accident_items', [
            'order_item_id' => $anotherOrderItem->id,
            'type' => AccidentType::DAMAGED_ITEM->value,
        ]);
    }

    public function test_cashier_cannot_report_accident_with_custom_outlet(): void
    {
        $this->actingAs($this->cashier);

        $response = $this->post(route('accidents.store'), $this->baseStorePayload([
            'outlet_id' => $this->anotherOutlet->id,
        ]));

        $response->assertSessionHasErrors(['outlet_id']);
    }

    public function test_cashier_creates_accident_uses_their_own_outlet(): void
    {
        $this->actingAs($this->cashier);

        $response = $this->post(route('accidents.store'), $this->baseStorePayload());

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('accidents', [
            'outlet_id' => $this->cashier->outlet_id,
            'reporter_id' => $this->cashier->id,
        ]);
        $this->assertDatabaseHas('accident_items', [
            'order_item_id' => $this->orderItem->id,
            'type' => AccidentType::DAMAGED_ITEM->value,
        ]);
    }

    public function test_accident_creates_multiple_items(): void
    {
        $extraOrderItem = OrderItem::create([
            'order_id' => $this->order->id,
            'service_item_id' => $this->orderItem->service_item_id,
            'item_name' => 'Celana Panjang',
            'item_price' => 5000,
            'unit' => 'pcs',
            'quantity' => 1,
            'subtotal' => 5000,
        ]);

        $this->actingAs($this->cashier);

        $response = $this->post(route('accidents.store'), [
            'outlet_id' => $this->cashier->outlet_id,
            'order_id' => $this->order->id,
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Sobek di lengan',
                ],
                [
                    'order_item_id' => $extraOrderItem->id,
                    'type' => AccidentType::COLOR_BLED->value,
                    'description' => 'Luntur kena baju putih',
                ],
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals(1, Accident::count());
        $this->assertEquals(2, AccidentItem::count());
    }

    public function test_store_rejects_empty_items_array(): void
    {
        $this->actingAs($this->cashier);

        $response = $this->post(route('accidents.store'), [
            'outlet_id' => $this->cashier->outlet_id,
            'order_id' => $this->order->id,
            'items' => [],
        ]);

        $response->assertSessionHasErrors(['items']);
    }

    public function test_store_rejects_duplicate_order_item_in_active_accident(): void
    {
        // Buat insiden aktif untuk orderItem yang sama
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::PENDING,
        ]);

        AccidentItem::create([
            'accident_id' => $accident->id,
            'order_item_id' => $this->orderItem->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Sudah dilaporkan sebelumnya',
        ]);

        $this->actingAs($this->cashier);

        $response = $this->post(route('accidents.store'), $this->baseStorePayload());

        $response->assertSessionHasErrors(['items.0.order_item_id']);
    }

    public function test_cashier_can_update_own_accident_description(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Catatan umum lama',
            'status' => AccidentStatus::PENDING,
        ]);

        $this->actingAs($this->cashier);

        $response = $this->patch(route('accidents.update', $accident), [
            'description' => 'Catatan umum baru yang diperbarui',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('accidents', [
            'id' => $accident->id,
            'description' => 'Catatan umum baru yang diperbarui',
        ]);
    }

    public function test_cashier_cannot_update_another_reporters_accident(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->anotherCashier->id,
            'description' => 'Catatan insiden kasir lain',
            'status' => AccidentStatus::PENDING,
        ]);

        $this->actingAs($this->cashier);

        $response = $this->patch(route('accidents.update', $accident), [
            'description' => 'Diubah oleh kasir lain',
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    public function test_cashier_cannot_update_sensitive_status_field(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Catatan insiden',
            'status' => AccidentStatus::PENDING,
        ]);

        $this->actingAs($this->cashier);

        $response = $this->patch(route('accidents.update', $accident), [
            'status' => AccidentStatus::RESOLVED->value,
        ]);

        $response->assertSessionHasErrors(['status']);
    }

    public function test_admin_can_resolve_accident(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Catatan insiden',
            'status' => AccidentStatus::INVESTIGATING,
        ]);

        $this->actingAs($this->admin);

        $response = $this->patch(route('accidents.update', $accident), [
            'status' => AccidentStatus::RESOLVED->value,
            'resolver_id' => $this->admin->id,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('accidents', [
            'id' => $accident->id,
            'status' => AccidentStatus::RESOLVED->value,
            'resolver_id' => $this->admin->id,
        ]);
        $this->assertNotNull($accident->fresh()->resolved_at);
    }

    public function test_admin_cannot_set_other_user_as_resolver(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Catatan insiden',
            'status' => AccidentStatus::PENDING,
        ]);

        $this->actingAs($this->admin);

        $response = $this->patch(route('accidents.update', $accident), [
            'resolver_id' => $this->superAdmin->id,
        ]);

        $response->assertSessionHasErrors(['resolver_id']);
    }

    public function test_finalized_accident_cannot_be_updated_tampering_prevention(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Catatan insiden',
            'status' => AccidentStatus::RESOLVED,
            'resolved_at' => now(),
        ]);

        $this->actingAs($this->admin);

        $response = $this->patch(route('accidents.update', $accident), [
            'description' => 'Ingin diubah meskipun sudah resolved',
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    public function test_super_admin_create_page_returns_outlets_dropdown(): void
    {
        $this->actingAs($this->superAdmin);

        $response = $this->get(route('accidents.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('accident/tambah')
            ->has('outlets')
            ->has('outletSelected')
            ->has('orders')
            ->has('orderItems')
            ->has('accidentTypeOptions')
        );
    }

    public function test_cashier_create_page_outlet_is_locked_to_own_outlet(): void
    {
        $this->actingAs($this->cashier);

        $response = $this->get(route('accidents.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('accident/tambah')
            ->where('outletSelected.data.id', $this->cashier->outlet_id)
        );
    }

    public function test_super_admin_store_rejects_order_not_belonging_to_selected_outlet(): void
    {
        $this->actingAs($this->superAdmin);

        $response = $this->post(route('accidents.store'), [
            'outlet_id' => $this->anotherOutlet->id,
            'order_id' => $this->order->id, // belongs to $this->outlet, not anotherOutlet
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Test',
                ],
            ],
        ]);

        $response->assertSessionHasErrors(['order_id']);
    }

    public function test_cannot_report_accident_for_pending_order(): void
    {
        $pendingOrder = Order::create([
            'outlet_id' => $this->outlet->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-PENDING',
            'customer_name' => 'Pending Cust',
            'total_price' => 5000,
            'status' => OrderStatus::PENDING,
        ]);

        $this->actingAs($this->cashier);

        $response = $this->post(route('accidents.store'), [
            'outlet_id' => $this->cashier->outlet_id,
            'order_id' => $pendingOrder->id,
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Test',
                ],
            ],
        ]);

        $response->assertSessionHasErrors(['order_id']);
    }

    public function test_cannot_report_accident_for_cancelled_order(): void
    {
        $cancelledOrder = Order::create([
            'outlet_id' => $this->outlet->id,
            'cashier_id' => $this->cashier->id,
            'order_code' => 'ORD-CANCELLED',
            'customer_name' => 'Cancelled Cust',
            'total_price' => 5000,
            'status' => OrderStatus::CANCELLED,
        ]);

        $this->actingAs($this->cashier);

        $response = $this->post(route('accidents.store'), [
            'outlet_id' => $this->cashier->outlet_id,
            'order_id' => $cancelledOrder->id,
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::DAMAGED_ITEM->value,
                    'description' => 'Test',
                ],
            ],
        ]);

        $response->assertSessionHasErrors(['order_id']);
    }

    public function test_rejected_accident_cannot_be_updated_to_resolved(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Catatan insiden',
            'status' => AccidentStatus::REJECTED,
        ]);

        $this->actingAs($this->admin);

        $response = $this->patch(route('accidents.update', $accident), [
            'status' => AccidentStatus::RESOLVED->value,
        ]);

        $response->assertSessionHasErrors(['status']);
    }

    public function test_staff_can_update_accident_if_status_is_pending(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Deskripsi awal',
            'status' => AccidentStatus::PENDING,
        ]);

        $item = AccidentItem::create([
            'accident_id' => $accident->id,
            'order_item_id' => $this->orderItem->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Detail awal',
        ]);

        $this->actingAs($this->cashier);

        $response = $this->patch(route('accidents.update', $accident), [
            'description' => 'Deskripsi diperbarui',
            'items' => [
                [
                    'id' => $item->id,
                    'type' => AccidentType::LOST_ITEM->value,
                    'item_details' => 'Barang hilang detail',
                    'description' => 'Detail diperbarui',
                ],
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('accidents', [
            'id' => $accident->id,
            'description' => 'Deskripsi diperbarui',
            'status' => AccidentStatus::PENDING->value,
        ]);
        $this->assertDatabaseHas('accident_items', [
            'id' => $item->id,
            'type' => AccidentType::LOST_ITEM->value,
            'item_details' => 'Barang hilang detail',
            'description' => 'Detail diperbarui',
        ]);
    }

    public function test_staff_cannot_update_accident_if_status_is_not_pending(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'description' => 'Deskripsi awal',
            'status' => AccidentStatus::INVESTIGATING,
        ]);

        $this->actingAs($this->cashier);

        $response = $this->patch(route('accidents.update', $accident), [
            'description' => 'Coba perbarui deskripsi',
        ]);

        $response->assertSessionHasErrors(['description']);
    }

    public function test_new_accident_can_be_reported_if_previous_accident_is_cancelled(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::CANCELLED,
        ]);

        AccidentItem::create([
            'accident_id' => $accident->id,
            'order_item_id' => $this->orderItem->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Laporan pertama',
        ]);

        $this->actingAs($this->cashier);

        $response = $this->post(route('accidents.store'), [
            'outlet_id' => $this->cashier->outlet_id,
            'order_id' => $this->order->id,
            'items' => [
                [
                    'order_item_id' => $this->orderItem->id,
                    'type' => AccidentType::LOST_ITEM->value,
                    'description' => 'Laporan baru setelah dibatalkan',
                ],
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseCount('accidents', 2);
    }

    public function test_transition_to_cancelled_is_allowed_for_admin(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::INVESTIGATING,
        ]);

        $this->actingAs($this->admin);

        $response = $this->patch(route('accidents.update', $accident), [
            'status' => AccidentStatus::CANCELLED->value,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('accidents', [
            'id' => $accident->id,
            'status' => AccidentStatus::CANCELLED->value,
            'resolver_id' => $this->admin->id,
        ]);
        $this->assertNotNull($accident->fresh()->resolved_at);
    }

    public function test_admin_can_update_compensation_type_and_amount(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::INVESTIGATING,
        ]);

        $item = AccidentItem::create([
            'accident_id' => $accident->id,
            'order_item_id' => $this->orderItem->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Detail awal',
        ]);

        $this->actingAs($this->admin);

        $response = $this->patch(route('accidents.update', $accident), [
            'status' => AccidentStatus::RESOLVED->value,
            'items' => [
                [
                    'id' => $item->id,
                    'type' => $item->type->value,
                    'description' => $item->description,
                    'compensation_type' => AccidentCompensationType::REFUND->value,
                    'compensation_amount' => 150000,
                ],
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('accident_items', [
            'id' => $item->id,
            'compensation_type' => AccidentCompensationType::REFUND->value,
            'compensation_amount' => 150000,
        ]);
    }

    public function test_admin_cannot_update_compensation_with_none_and_amount_greater_than_zero(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::INVESTIGATING,
        ]);

        $item = AccidentItem::create([
            'accident_id' => $accident->id,
            'order_item_id' => $this->orderItem->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Detail awal',
        ]);

        $this->actingAs($this->admin);

        $response = $this->patch(route('accidents.update', $accident), [
            'status' => AccidentStatus::RESOLVED->value,
            'items' => [
                [
                    'id' => $item->id,
                    'type' => $item->type->value,
                    'description' => $item->description,
                    'compensation_type' => AccidentCompensationType::NONE->value,
                    'compensation_amount' => 100, // Harus ditolak karena compensation_type adalah none
                ],
            ],
        ]);

        $response->assertSessionHasErrors(['items.0.compensation_amount']);
    }

    public function test_admin_cannot_update_compensation_with_non_none_and_zero_amount(): void
    {
        $accident = Accident::create([
            'outlet_id' => $this->outlet->id,
            'order_id' => $this->order->id,
            'reporter_id' => $this->cashier->id,
            'status' => AccidentStatus::INVESTIGATING,
        ]);

        $item = AccidentItem::create([
            'accident_id' => $accident->id,
            'order_item_id' => $this->orderItem->id,
            'type' => AccidentType::DAMAGED_ITEM,
            'description' => 'Detail awal',
        ]);

        $this->actingAs($this->admin);

        $response = $this->patch(route('accidents.update', $accident), [
            'status' => AccidentStatus::RESOLVED->value,
            'items' => [
                [
                    'id' => $item->id,
                    'type' => $item->type->value,
                    'description' => $item->description,
                    'compensation_type' => AccidentCompensationType::REFUND->value,
                    'compensation_amount' => 0, // Harus ditolak karena refund butuh min 1
                ],
            ],
        ]);

        $response->assertSessionHasErrors(['items.0.compensation_amount']);
    }
}
