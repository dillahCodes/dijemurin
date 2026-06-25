<?php

namespace App\Services\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Enums\Service\ServiceTimeType;
use App\Enums\User\UserRole;
use App\Models\Order\Order;
use App\Models\Service\ServiceItem;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    /**
     * Create a new order
     */
    public static function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $cartItems = collect($data['cart_items']);
            $serviceItems = self::resolveServiceItems($cartItems);
            $totalPrice = self::sumTotalPrice($cartItems, $serviceItems);

            $estimatedCompletedAt = self::calculateEstimatedCompletedAt($serviceItems);

            $order = self::createOrderRecord($data, $totalPrice, $estimatedCompletedAt);
            self::createOrderItems($order, $cartItems, $serviceItems);
            self::createOrderPayment($order, $data, $totalPrice);

            // Log initial status log
            OrderStatusLogService::log(
                order: $order,
                fromStatus: null,
                toStatus: OrderStatus::PENDING,
                userId: auth()->user()->id
            );

            return $order;
        });
    }

    /**
     * Update an existing order
     */
    public static function updateOrder(array $data, Order $order): Order
    {
        return DB::transaction(function () use ($data, $order) {
            $currentStatus = $order->status;
            $newStatus = $data['status'];
            $newStatusEnum = OrderStatus::from($newStatus);

            $isNewStatusCompleted = in_array($newStatus, [OrderStatus::DONE->value, OrderStatus::PICKED_UP->value]);
            $isCurrentStatusCompleted = in_array($currentStatus->value, [OrderStatus::DONE->value, OrderStatus::PICKED_UP->value]);

            $data['completed_at'] = match ([$isNewStatusCompleted, $isCurrentStatusCompleted]) {
                [true, false] => now(),
                [false, true] => null,
                default => $order->completed_at,
            };

            $isNewStatusPickedUp = $newStatus === OrderStatus::PICKED_UP->value;
            $isCurrentStatusPickedUp = $currentStatus === OrderStatus::PICKED_UP->value;

            $data['picked_up_at'] = match ([$isNewStatusPickedUp, $isCurrentStatusPickedUp]) {
                [true, false] => now(),
                [false, true] => null,
                default => $order->picked_up_at,
            };

            $order->update($data);

            if ($currentStatus !== $newStatusEnum) {
                OrderStatusLogService::log(
                    order: $order,
                    fromStatus: $currentStatus,
                    toStatus: $newStatusEnum,
                    userId: auth()->id()
                );
            }

            return $order;
        });
    }

    private static function resolveServiceItems(Collection $cartItems): Collection
    {
        return ServiceItem::whereIn('id', $cartItems->pluck('id'))
            ->get(['id', 'price', 'name', 'unit', 'time_number', 'time_type'])
            ->keyBy('id');
    }

    private static function calculateEstimatedCompletedAt(Collection $serviceItems): CarbonInterface
    {
        $maxDurationMinutes = 0;

        foreach ($serviceItems as $serviceItem) {
            $timeType = $serviceItem->time_type;
            $enumType = $timeType instanceof ServiceTimeType ? $timeType : ServiceTimeType::tryFrom($timeType);
            $minutes = $enumType ? $enumType->toMinutes($serviceItem->time_number) : 0;

            if ($minutes > $maxDurationMinutes) {
                $maxDurationMinutes = $minutes;
            }
        }

        return now()->addMinutes($maxDurationMinutes);
    }

    private static function createOrderRecord(array $data, int $totalPrice, CarbonInterface $estimatedCompletedAt): Order
    {
        $isSuperAdmin = auth()->user()->hasAnyRole([UserRole::SUPER_ADMIN]);
        $outletId = $isSuperAdmin ? $data['outlet_id'] ?? null : auth()->user()->outlet_id;

        if ($isSuperAdmin && ! $outletId) {
            throw new \Exception('Outlet belum terpilih');
        }

        return Order::create([
            'outlet_id' => $outletId,
            'cashier_id' => auth()->user()->id,
            'order_code' => self::generateOrderCode($data['customer_name']),
            'customer_name' => $data['customer_name'],
            'status' => OrderStatus::PENDING,
            'total_price' => $totalPrice,
            'estimated_completed_at' => $estimatedCompletedAt,
        ]);
    }

    private static function createOrderItems(Order $order, Collection $cartItems, Collection $serviceItems): void
    {
        $orderItems = $serviceItems->map(fn ($serviceItem) => [
            'order_id' => $order->id,
            'service_item_id' => $serviceItem->id,
            'item_name' => $serviceItem->name,
            'item_price' => $serviceItem->price,
            'unit' => $serviceItem->unit,
            'quantity' => $cartItems->firstWhere('id', $serviceItem->id)['qty'],
            'subtotal' => $serviceItem->price * $cartItems->firstWhere('id', $serviceItem->id)['qty'],
        ])->toArray();

        $order->orderItems()->createMany($orderItems);
    }

    private static function createOrderPayment(Order $order, array $data, int $totalPrice): void
    {
        $isCash = $data['payment_method'] === PaymentMethod::CASH->value;

        $order->payment()->create([
            'order_id' => $order->id,
            'method' => $data['payment_method'],
            'cash_payment_amount' => $isCash ? $data['payment_amount'] : null,
            'cash_change_amount' => $isCash ? $data['payment_amount'] - $totalPrice : null,
        ]);
    }

    public static function sumTotalPrice(Collection $cartItems, Collection $serviceItems): int
    {
        return $cartItems->sum(function ($item) use ($serviceItems) {
            $serviceItem = $serviceItems->get($item['id']);

            return $serviceItem ? $serviceItem->price * $item['qty'] : 0;
        });
    }

    public static function generateOrderCode(string $customerName): string
    {
        $name = User::getInitials($customerName);
        $date = now()->format('Ymd');
        $random = Str::upper(Str::random(3));

        return "ORD-{$name}-{$date}-{$random}";
    }
}
