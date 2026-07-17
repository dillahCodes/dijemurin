<?php

namespace App\Services\Order;

use App\DTOs\Order\OrderComboboxFilterDTO;
use App\DTOs\Order\OrderFilterDTO;
use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\Enums\Order\OrderStatus;
use App\Enums\Order\OrderTimeStatus;
use App\Enums\User\UserRole;
use App\Http\Resources\Order\OrderComboboxResource;
use App\Http\Resources\Order\OrderDetailResource;
use App\Http\Resources\Order\OrderItemComboboxResource;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use Illuminate\Validation\ValidationException;

class OrderQueryService
{
    /**
     * Get orders data with filters
     */
    public static function getOrdersData(OrderFilterDTO $filter, ?OutletComboboxFilterDTO $outletFilter)
    {
        $user = auth()->user();
        $hasSuperAdmin = $user?->hasRole(UserRole::SUPER_ADMIN) ?? false;

        $query = Order::query()
            ->with(['outlet', 'payment'])
            ->search($filter->search)
            ->filterStatus($filter->status)
            ->paymentMethod($filter->paymentMethod)
            ->filterDateRange($filter->startDate, $filter->endDate, $filter->dateType);

        // NOTE: Super admin can see all orders, but other users can only see their outlet's orders.
        $hasSuperAdmin
            ? $query->filterOutlet($outletFilter?->outletIdSelected)
            : $query->where('outlet_id', $user->outlet_id);

        match ($filter->timeStatus) {
            OrderTimeStatus::OVERDUE => $query->overdue(),
            OrderTimeStatus::ALMOST_OVERDUE => $query->almostOverdue(),
            default => null,
        };

        $withPagination = $query->latest()->paginate($filter->limit)->withQueryString();

        return OrderResource::collection($withPagination);
    }

    /**
     * Get Order detail
     */
    public static function getOrderDetail(Order $order)
    {
        $order->load(['orderItems', 'payment', 'outlet', 'cashier', 'statusLogs.user']);

        return new OrderDetailResource($order);
    }

    /**
     * Get Order detail by order code
     */
    public static function getOrderDetailByCode(?string $orderCode)
    {
        if (! $orderCode) {
            throw ValidationException::withMessages([
                'order_code' => 'Order code is required',
            ]);
        }

        $order = Order::where('order_code', $orderCode)
            ->whereNotIn('status', [OrderStatus::CANCELLED->value])
            ->first();

        if (! $order) {
            throw ValidationException::withMessages([
                'order_code' => 'Order not found',
            ]);
        }

        $order->load(['orderItems', 'payment', 'outlet', 'cashier', 'statusLogs.user']);

        return new OrderDetailResource($order);
    }

    /**
     * Get orders for combobox selection, filtered by outlet and search query.
     */
    public static function getOrdersComboboxData(OrderComboboxFilterDTO $filter)
    {
        $hasSuperAdmin = auth()->user()?->hasRole(UserRole::SUPER_ADMIN) ?? false;
        $outletIdSelected = $hasSuperAdmin ? $filter->outletId : auth()->user()->outlet_id;

        $orders = Order::query()
            ->forOutlet($outletIdSelected)
            ->searchCode($filter->orderSearch)
            ->latest()
            ->paginate($filter->limit)
            ->withQueryString();

        return OrderComboboxResource::collection($orders);
    }

    /**
     * Get order items for combobox selection, filtered by the selected order.
     */
    public static function getOrderItemsComboboxData(OrderComboboxFilterDTO $filter)
    {
        if (! $filter->orderIdSelected) {
            return OrderItemComboboxResource::collection(collect([]));
        }

        $orderItems = OrderItem::query()
            ->where('order_id', $filter->orderIdSelected)
            ->paginate($filter->limit)
            ->withQueryString();

        return OrderItemComboboxResource::collection($orderItems);
    }
}
