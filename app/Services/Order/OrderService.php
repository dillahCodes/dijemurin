<?php

namespace App\Services\Order;

use App\Enums\Payment\PaymentMethod;
use App\Helpers\StringHelper;
use App\Models\Order\Order;
use App\Models\Service\ServiceItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
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
