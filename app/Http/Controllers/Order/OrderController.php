<?php

namespace App\Http\Controllers\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\OrderStoreRequest;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order\Order;
use App\Services\Order\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // search params
        $search = $request->query('search');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $status = $request->query('status', '');
        $paymentMethod = $request->query('payment_method', '');

        // convert string to enum
        $statusEnum = OrderStatus::tryFrom($status);
        $paymentMethodEnum = PaymentMethod::tryFrom($paymentMethod);
        
        // query orders with payment relationship
        $orders = Order::with('payment')->search($search)
            ->filterStatus($statusEnum)
            ->filterPaymentMethod($paymentMethodEnum)
            ->filterDateRange($startDate, $endDate)
            ->latest()
            ->get();

        return Inertia::render('order/order', [
            'orderStatusOptions' => OrderStatus::options(),
            'paymentMethodOptions' => PaymentMethod::options(),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
                'payment_method' => $paymentMethod ?? '',
                'start_date' => $startDate ?? '',
                'end_date' => $endDate ?? '',
            ],
            'orders' => OrderResource::collection($orders),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(array $data)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrderStoreRequest $request)
    {
        $data = $request->validated();

        OrderService::createOrder($data);

        return redirect()->route('order.index')->with(['success' => 'Pesanan berhasil dibuat']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
