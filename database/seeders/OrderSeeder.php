<?php

namespace Database\Seeders;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Models\Service\ServiceItem;
use Carbon\CarbonInterface;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    private const TOTAL_ORDERS = 100;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $serviceItems = ServiceItem::all();

        if ($serviceItems->isEmpty()) {
            $this->command->warn('ServiceItem masih kosong. Jalankan ServiceItemSeeder terlebih dahulu.');

            return;
        }

        for ($i = 1; $i <= self::TOTAL_ORDERS; $i++) {
            $this->createOrder($i, $serviceItems);
        }
    }

    /**
     * Buat satu order beserta order_items dan payment-nya.
     */
    private function createOrder(int $index, $serviceItems): void
    {
        $orderAt = now()->subDays(rand(0, 90))->subHours(rand(0, 23));
        $status = $this->randomStatus();

        // Ambil 1-4 item secara acak
        $selectedItems = $serviceItems->random(rand(1, min(4, $serviceItems->count())));

        // Hitung subtotal per item dan total_price
        $orderItems = $selectedItems->map(function (ServiceItem $item) {
            $quantity = $this->randomQuantity($item->unit);
            $subtotal = (int) ($item->price * $quantity);

            return [
                'service_item_id' => $item->id,
                'item_name' => $item->name,
                'item_price' => $item->price,
                'unit' => $item->unit,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
            ];
        });

        $totalPrice = $orderItems->sum('subtotal');

        // Insert order
        $orderId = DB::table('orders')->insertGetId([
            'order_code' => $this->generateOrderCode($index),
            'customer_name' => $this->randomCustomerName(),
            'status' => $status->value,
            'total_price' => $totalPrice,
            'order_at' => $orderAt,
            'completed_at' => in_array($status, [OrderStatus::DONE, OrderStatus::PICKED_UP])
                ? $orderAt->copy()->addDays(rand(1, 3))
                : null,
            'created_at' => $orderAt,
            'updated_at' => $orderAt,
        ]);

        // Insert order_items
        $orderItemsData = $orderItems->map(fn (array $item) => [
            ...$item,
            'order_id' => $orderId,
            'created_at' => $orderAt,
            'updated_at' => $orderAt,
        ])->toArray();

        DB::table('order_items')->insert($orderItemsData);

        // Insert payment
        $this->createPayment($orderId, $totalPrice, $orderAt);
    }

    /**
     * Buat payment untuk order.
     */
    private function createPayment(int $orderId, int $totalPrice, CarbonInterface $orderAt): void
    {
        $method = $this->randomPaymentMethod();

        $cashPaymentAmount = null;
        $cashChangeAmount = null;

        if ($method === PaymentMethod::CASH) {
            // Bulatkan ke atas ke nominal yang lazim (+ kembalian)
            $cashPaymentAmount = $this->roundUpCash($totalPrice);
            $cashChangeAmount = $cashPaymentAmount - $totalPrice;
        }

        DB::table('payments')->insert([
            'order_id' => $orderId,
            'method' => $method->value,
            'cash_payment_amount' => $cashPaymentAmount,
            'cash_change_amount' => $cashChangeAmount,
            'created_at' => $orderAt,
            'updated_at' => $orderAt,
        ]);
    }

    // -----------------------------------------------------------------------
    // Helper methods
    // -----------------------------------------------------------------------

    private function generateOrderCode(int $index): string
    {
        return 'ORD-'.now()->format('Ymd').'-'.str_pad($index, 4, '0', STR_PAD_LEFT);
    }

    private function randomStatus(): OrderStatus
    {
        $statuses = OrderStatus::cases();

        return $statuses[array_rand($statuses)];
    }

    private function randomPaymentMethod(): PaymentMethod
    {
        $methods = PaymentMethod::cases();

        return $methods[array_rand($methods)];
    }

    /**
     * Quantity realistis berdasarkan satuan item.
     */
    private function randomQuantity(string $unit): float
    {
        return match ($unit) {
            'kg' => round(rand(10, 100) / 10, 1),   // 1.0 – 10.0 kg
            'pcs' => rand(1, 5),
            'pasang' => rand(1, 3),
            'buah' => rand(1, 4),
            default => rand(1, 5),
        };
    }

    private function randomCustomerName(): string
    {
        $names = [
            'Budi Santoso', 'Siti Rahayu', 'Ahmad Fauzi', 'Dewi Lestari', 'Eko Prasetyo',
            'Fitri Handayani', 'Gilang Ramadhan', 'Hana Pertiwi', 'Ivan Kurniawan', 'Joko Widodo',
            'Kartika Sari', 'Lukman Hakim', 'Maya Anggraini', 'Nanda Putra', 'Olivia Susanti',
            'Panji Kusuma', 'Qori Amelia', 'Riko Pratama', 'Sari Wulandari', 'Taufik Hidayat',
            'Ulfa Novita', 'Vino Bastian', 'Wulan Sari', 'Xaverius Hendra', 'Yanti Marlina',
            'Zaki Maulana', 'Agus Supriyanto', 'Bella Safitri', 'Cahya Nugraha', 'Dina Puspita',
        ];

        return $names[array_rand($names)];
    }

    /**
     * Bulatkan total ke nominal uang yang lebih besar (kelipatan 5.000 atau 10.000).
     */
    private function roundUpCash(int $total): int
    {
        $step = $total > 50000 ? 10000 : 5000;

        return (int) (ceil($total / $step) * $step);
    }
}
