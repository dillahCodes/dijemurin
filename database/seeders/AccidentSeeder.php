<?php

namespace Database\Seeders;

use App\Enums\Accident\AccidentCompensationType;
use App\Enums\Accident\AccidentStatus;
use App\Enums\Accident\AccidentType;
use App\Enums\User\UserRole;
use App\Models\Order\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = Order::with('orderItems')->get();

        if ($orders->isEmpty()) {
            $this->command->warn('Orders masih kosong. Jalankan OrderSeeder terlebih dahulu.');

            return;
        }

        // Ambil kasir & admin/super_admin untuk reporter dan resolver
        $cashiers = User::where('role', UserRole::CASHIER)->get();
        $admins = User::whereIn('role', [UserRole::ADMIN, UserRole::SUPER_ADMIN])->get();

        if ($cashiers->isEmpty()) {
            $this->command->warn('User Kasir kosong. Silakan jalankan UserSeeder/SuperAdminSeeder dahulu.');

            return;
        }

        if ($admins->isEmpty()) {
            $this->command->warn('User Admin/Super Admin kosong. Silakan jalankan UserSeeder/SuperAdminSeeder dahulu.');

            return;
        }

        // Ambil 15 order secara acak untuk disimulasikan sebagai insiden
        $targetOrders = $orders->random(min(15, $orders->count()));

        foreach ($targetOrders as $order) {
            $this->createAccidentForOrder($order, $cashiers, $admins);
        }
    }

    private function createAccidentForOrder(Order $order, $cashiers, $admins): void
    {
        if ($order->orderItems->isEmpty()) {
            return;
        }

        $status = $this->randomStatus();
        $reporter = $cashiers->random();

        $resolverId = null;
        $resolvedAt = null;

        if (in_array($status, [AccidentStatus::RESOLVED, AccidentStatus::REJECTED])) {
            $resolver = $admins->random();
            $resolverId = $resolver->id;
            $resolvedAt = $order->created_at->copy()->addDays(rand(1, 5));
        }

        $createdAt = $order->created_at->copy()->addHours(rand(1, 12));

        // Buat header accident
        $accidentId = DB::table('accidents')->insertGetId([
            'outlet_id' => $order->outlet_id,
            'order_id' => $order->id,
            'reporter_id' => $reporter->id,
            'resolver_id' => $resolverId,
            'description' => null,
            'status' => $status->value,
            'resolved_at' => $resolvedAt,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);

        // Pilih 1 atau 2 item secara acak dari order tersebut
        $itemCount = min(rand(1, 2), $order->orderItems->count());
        $selectedItems = $order->orderItems->random($itemCount);

        $itemsData = [];

        foreach ($selectedItems as $orderItem) {
            $type = $this->randomType();

            $compensationType = null;
            $compensationAmount = null;

            if ($status === AccidentStatus::RESOLVED) {
                $compensationType = $this->randomCompensationType()->value;
                if ($compensationType !== AccidentCompensationType::NONE->value) {
                    $compensationAmount = $compensationType === AccidentCompensationType::REFUND->value
                        ? $order->total_price
                        : rand(10000, 100000);
                }
            }

            $itemsData[] = [
                'accident_id' => $accidentId,
                'order_item_id' => $orderItem->id,
                'type' => $type->value,
                'item_details' => $orderItem->item_name,
                'description' => $this->randomDescription($type, $orderItem->item_name),
                'compensation_type' => $compensationType,
                'compensation_amount' => $compensationAmount,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];
        }

        DB::table('accident_items')->insert($itemsData);
    }

    private function randomType(): AccidentType
    {
        $types = [
            AccidentType::LOST_ITEM,
            AccidentType::DAMAGED_ITEM,
            AccidentType::COLOR_BLED,
            AccidentType::SHRUNK_ITEM,
            AccidentType::LATE_DELIVERY,
            AccidentType::WRONG_DELIVERY,
        ];

        return $types[array_rand($types)];
    }

    private function randomStatus(): AccidentStatus
    {
        $statuses = [
            AccidentStatus::PENDING,
            AccidentStatus::INVESTIGATING,
            AccidentStatus::RESOLVED,
            AccidentStatus::REJECTED,
        ];

        return $statuses[array_rand($statuses)];
    }

    private function randomCompensationType(): AccidentCompensationType
    {
        $types = [
            AccidentCompensationType::NONE,
            AccidentCompensationType::REFUND,
            AccidentCompensationType::REPLACEMENT,
            AccidentCompensationType::FREE_SERVICE,
            AccidentCompensationType::REPAIR,
        ];

        return $types[array_rand($types)];
    }

    private function randomDescription(AccidentType $type, string $itemName): string
    {
        return match ($type) {
            AccidentType::LOST_ITEM => "Item '{$itemName}' dilaporkan hilang setelah proses pencucian massal selesai.",
            AccidentType::DAMAGED_ITEM => "Ditemukan sobekan kecil di bagian jahitan samping pada '{$itemName}' saat proses setrika uap.",
            AccidentType::COLOR_BLED => "Warna pakaian lain luntur mengenai '{$itemName}' sehingga ada bercak warna lain di punggung.",
            AccidentType::SHRUNK_ITEM => "Item '{$itemName}' menyusut setelah dikeringkan menggunakan pengering suhu tinggi.",
            AccidentType::LATE_DELIVERY => 'Pengerjaan terlambat karena antrean overload pada mesin cuci dan kekurangan staf lipat.',
            AccidentType::WRONG_DELIVERY => 'Cucian pelanggan tertukar atau salah antarkan ke pelanggan lain saat penyerahan.',
            default => 'Terjadi kesalahan operasional pada penanganan barang pelanggan.',
        };
    }
}
