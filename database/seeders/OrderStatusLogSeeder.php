<?php

namespace Database\Seeders;

use App\Enums\Order\OrderStatus;
use App\Models\Order\Order;
use App\Models\Order\OrderStatusLog;
use Illuminate\Database\Seeder;

class OrderStatusLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = Order::all();

        foreach ($orders as $order) {
            $this->seedLogsForOrder($order);
        }
    }

    /**
     * Seed logs for a single order sequentially based on its current status.
     */
    private function seedLogsForOrder(Order $order): void
    {
        $orderAt = $order->created_at;
        $cashierId = $order->cashier_id;

        // Log 1: null -> pending (when order was created)
        OrderStatusLog::create([
            'order_id' => $order->id,
            'user_id' => $cashierId,
            'from_status' => null,
            'to_status' => OrderStatus::PENDING,
            'created_at' => $orderAt,
            'updated_at' => $orderAt,
        ]);

        if ($order->status === OrderStatus::PENDING) {
            return;
        }

        if ($order->status === OrderStatus::CANCELLED) {
            // Log 2: pending -> cancelled
            $cancelledAt = $orderAt->copy()->addMinutes(rand(30, 720)); // cancelled within 12 hours
            OrderStatusLog::create([
                'order_id' => $order->id,
                'user_id' => $cashierId,
                'from_status' => OrderStatus::PENDING,
                'to_status' => OrderStatus::CANCELLED,
                'created_at' => $cancelledAt,
                'updated_at' => $cancelledAt,
            ]);

            return;
        }

        // For PROCESS, DONE, and PICKED_UP, they all go to PROCESS first
        $processAt = $orderAt->copy()->addMinutes(rand(10, 180)); // processed within 3 hours
        OrderStatusLog::create([
            'order_id' => $order->id,
            'user_id' => $cashierId,
            'from_status' => OrderStatus::PENDING,
            'to_status' => OrderStatus::PROCESS,
            'created_at' => $processAt,
            'updated_at' => $processAt,
        ]);

        if ($order->status === OrderStatus::PROCESS) {
            return;
        }

        // For DONE and PICKED_UP, they both go to DONE
        $completedAt = $order->completed_at ?? $processAt->copy()->addDays(rand(1, 2));
        OrderStatusLog::create([
            'order_id' => $order->id,
            'user_id' => $cashierId,
            'from_status' => OrderStatus::PROCESS,
            'to_status' => OrderStatus::DONE,
            'created_at' => $completedAt,
            'updated_at' => $completedAt,
        ]);

        if ($order->status === OrderStatus::DONE) {
            return;
        }

        if ($order->status === OrderStatus::PICKED_UP) {
            // Log 4: done -> picked up
            $pickedUpAt = $completedAt->copy()->addHours(rand(1, 48)); // picked up within 2 days
            OrderStatusLog::create([
                'order_id' => $order->id,
                'user_id' => $cashierId,
                'from_status' => OrderStatus::DONE,
                'to_status' => OrderStatus::PICKED_UP,
                'created_at' => $pickedUpAt,
                'updated_at' => $pickedUpAt,
            ]);
        }
    }
}
