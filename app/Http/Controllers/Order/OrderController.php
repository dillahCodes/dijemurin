<?php

namespace App\Http\Controllers\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\OrderStoreRequest;
use App\Http\Requests\Order\OrderUpdateRequest;
use App\Http\Resources\Order\OrderDetailResource;
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
        return Inertia::render('order/order', [
            'orderStatusOptions' => OrderStatus::options(),
            'paymentMethodOptions' => PaymentMethod::options(),
            'filters' => $request->only(['search', 'status', 'payment_method', 'start_date', 'end_date']),
            'orders' => $this->getOrdersData($request),
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
        $loadOrderDetail = $order->load(['orderItem', 'payment']);
        $orderDetail = new OrderDetailResource($loadOrderDetail);

        return Inertia::render('order/order-detail', [
            'detailOrder' => $orderDetail,
        ]);
    }

    /**
     * Print the specified resource.
     */
    public function print(Order $order)
    {
        $loadOrderDetail = $order->load(['orderItem', 'payment']);
        $orderDetail = new OrderDetailResource($loadOrderDetail);

        return $orderDetail;
    }

    private function getOrdersData(Request $request)
    {
        $statusEnum = OrderStatus::tryFrom($request->query('status', ''));
        $paymentMethodEnum = PaymentMethod::tryFrom($request->query('payment_method', ''));

        $orders = Order::with('payment')
            ->search($request->query('search'))
            ->filterStatus($statusEnum)
            ->filterPaymentMethod($paymentMethodEnum)
            ->filterDateRange($request->query('start_date'), $request->query('end_date'))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return OrderResource::collection($orders);
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
    public function update(OrderUpdateRequest $request, Order $order)
    {
        $data = $request->validated();
        OrderService::updateOrder($data, $order);

        return redirect()->back()->with(['success' => 'Pesanan berhasil diupdate']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
