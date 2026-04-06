<?php

namespace App\Services\Order;

use App\DTOs\Order\OrderFilterDTO;
use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Helpers\StringHelper;
use App\Http\Resources\Order\OrderDetailResource;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order\Order;
use App\Models\Service\ServiceItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Create a new order
     */
    public static function createOrder(array $data)
    {
        return DB::transaction(function () use ($data) {
            // get cart items from FE and get service items data from DB
            $cartItems = collect($data['cart_items']);
            $serviceItems = ServiceItem::whereIn('id', $cartItems->pluck('id'))->get(['id', 'price', 'name', 'unit'])->keyBy('id');

            $totalPrice = self::sumTotalPrice($cartItems, $serviceItems);
            $cashPaymentAmount = $data['payment_method'] === PaymentMethod::CASH->value ? $data['payment_amount'] : null;
            $cashChangeAmount = $data['payment_method'] === PaymentMethod::CASH->value ? $data['payment_amount'] - $totalPrice : null;

            self::validatePayment($data, $totalPrice);

            // insert order data
            $order = Order::create([
                'order_code' => self::generateOrderCode($data['customer_name']),
                'customer_name' => $data['customer_name'],
                'total_price' => $totalPrice,
            ]);

            // create and insert order items
            $orderItems = $serviceItems->map(fn ($serviceItem) => [
                'order_id' => $order->id,
                'service_item_id' => $serviceItem->id,
                'item_name' => $serviceItem->name,
                'item_price' => $serviceItem->price,
                'unit' => $serviceItem->unit,
                'quantity' => $cartItems->firstWhere('id', $serviceItem->id)['qty'],
                'subtotal' => $serviceItem->price * $cartItems->firstWhere('id', $serviceItem->id)['qty'],
            ])->toArray();

            $order->orderItem()->createMany($orderItems);

            // insert payment data
            $payment = [
                'order_id' => $order->id,
                'method' => $data['payment_method'],
                'cash_payment_amount' => $cashPaymentAmount,
                'cash_change_amount' => $cashChangeAmount,
            ];

            $order->payment()->create($payment);

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

            $isNewStatusDone = $newStatus === OrderStatus::DONE->value;
            $isCurrentStatusDone = $currentStatus === OrderStatus::DONE->value;

            if ($isNewStatusDone && ! $isCurrentStatusDone) {
                $data['completed_at'] = now();
            }

            if ($isCurrentStatusDone && ! $isNewStatusDone) {
                $data['completed_at'] = null;
            }

            $order->update($data);

            return $order;
        });
    }

    /**
     * Get orders data with filters
     */
    public static function getOrdersData(OrderFilterDTO $filter)
    {
        $orders = Order::with('payment')
            ->search($filter->search)
            ->filterStatus($filter->status)
            ->filterPaymentMethod($filter->paymentMethod)
            ->filterDateRange($filter->startDate, $filter->endDate)
            ->latest()
            ->paginate($filter->limit)
            ->withQueryString();

        return OrderResource::collection($orders);
    }

    /**
     * Get Order detail
     */
    public static function getOrderDetail(Order $order)
    {
        $order->load(['orderItem', 'payment']);

        return new OrderDetailResource($order);
    }

    public static function getTodayOrderCount(): int
    {
        return Order::whereBetween('created_at', [
            now()->startOfDay(),
            now()->endOfDay(),
        ])
            ->whereNot('status', OrderStatus::CANCELLED->value)
            ->count();
    }

    /**
     * Get Process Order Count
     */
    public static function getProcessOrderCount(): int
    {
        return Order::process()->count();
    }

    /**
     * Get Done Order Count
     */
    public static function getDoneOrderCount(): int
    {
        return Order::done()->count();
    }

    /**
     * Get Today Revenue
     */
    public static function getTodayRevenue(): int
    {
        return Order::today()->revenueStatuses()->sum('total_price');
    }

    /**
     * Get Week Revenue for chart
     */
    public static function getChartWeekRevenue(): array
    {
        $orders = Order::thisWeek()->revenueStatuses()->get(['created_at', 'total_price']);

        $days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

        // ex: items: [2026-04-06 => collection, 2026-04-07 => collection]
        $grouped = $orders->groupBy(fn ($order) => $order->created_at->format('Y-m-d'));

        return collect($days)->map(function ($day, $index) use ($grouped) {
            // ex: 2026-04-06
            $date = now()->startOfWeek()->addDays($index)->format('Y-m-d');
            // ex: 100000
            $sumRevenueThisDay = $grouped->get($date)?->sum('total_price') ?? 0;

            return ['name' => $day, 'total' => $sumRevenueThisDay];
        })->values()->toArray();
    }

    /**
     * Get Month Statuses for chart
     */
    public static function getChartMonthStatuses()
    {
        $orders = Order::thisMonth()->get(['status']);
        $englishStatuses = OrderStatus::toArray();

        return collect($englishStatuses)->map(function ($status) use ($orders) {
            $count = $orders->where('status', $status)->count();
            $enum = OrderStatus::from($status);

            $labelValue = ['name' => $enum->indonesianLabel(), 'value' => $enum->value];

            return ['label' => $labelValue, 'value' => $count];
        })->toArray();
    }

    public static function validatePayment(array $data, int $totalPrice): void
    {
        $isCash = $data['payment_method'] === PaymentMethod::CASH->value;

        if ($isCash && $data['payment_amount'] < $totalPrice) {
            throw ValidationException::withMessages([
                'payment_amount' => 'Jumlah bayar tunai (cash) kurang dari total tagihan.',
            ]);
        }
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
        $name = StringHelper::getInitials($customerName);
        $date = now()->format('Ymd');
        $random = Str::upper(Str::random(3));

        return "ORD-{$name}-{$date}-{$random}";
    }
}
