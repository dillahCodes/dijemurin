<?php

namespace App\Http\Controllers\Order;

use App\DTOs\Order\OrderCustomerStatusDTO;
use App\DTOs\Order\OrderFilterDTO;
use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\Enums\Order\OrderDateType;
use App\Enums\Order\OrderStatus;
use App\Enums\Order\OrderTimeStatus;
use App\Enums\Payment\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\OrderStoreRequest;
use App\Http\Requests\Order\OrderUpdateRequest;
use App\Models\Order\Order;
use App\Services\Order\OrderQueryService;
use App\Services\Order\OrderService;
use App\Services\Outlet\OutletQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterOrder = OrderFilterDTO::fromRequest($request);
        $filterOutlet = OutletComboboxFilterDTO::fromRequest($request);
        $filters = [...$filterOrder->toArray(), ...$filterOutlet->toArray()];

        $orderStatusOptions = OrderStatus::options();
        $orderTimeStatusOptions = OrderTimeStatus::options();
        $orderDateTypeOptions = OrderDateType::options();
        $paymentMethodOptions = PaymentMethod::options();
        $orderTransitionRules = OrderStatus::allowedRoleTransitions();

        $orders = OrderQueryService::getOrdersData($filterOrder, $filterOutlet);
        $outlets = OutletQueryService::getOutletsComboboxData($filterOutlet);
        $outletSelected = OutletQueryService::getOutletComboboxSelectedData($filterOutlet);

        return Inertia::render('order/order', [
            'orderStatusOptions' => $orderStatusOptions,
            'orderTimeStatusOptions' => $orderTimeStatusOptions,
            'orderDateTypeOptions' => $orderDateTypeOptions,
            'paymentMethodOptions' => $paymentMethodOptions,
            'orderTransitionRules' => $orderTransitionRules,
            'filters' => $filters,
            'orders' => $orders,
            'outlets' => $outlets,
            'outletSelected' => $outletSelected,
        ]);
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
        $orderDetail = OrderQueryService::getOrderDetail($order);

        return Inertia::render('order/order-detail', [
            'detailOrder' => $orderDetail,
        ]);
    }

    /**
     * Print the specified resource.
     */
    public function print(Order $order)
    {
        $orderDetail = OrderQueryService::getOrderDetail($order);

        return $orderDetail;

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
     * Show status order for customer
     */
    public function customerStatusOrder(Request $request)
    {
        $orderCodeParam = OrderCustomerStatusDTO::fromRequest($request);
        $orderCode = $orderCodeParam->orderCode;
        $orderDetail = OrderQueryService::getOrderDetailByCode($orderCode);

        return Inertia::render('order/order-customer-status', [
            'orderDetail' => $orderDetail,
        ]);
    }
}
