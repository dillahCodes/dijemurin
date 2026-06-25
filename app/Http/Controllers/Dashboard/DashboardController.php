<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\Payment\PaymentMethod;
use App\Enums\User\UserRole;
use App\Http\Controllers\Controller;
use App\Services\Order\OrderStatsService;
use App\Services\Outlet\OutletStatsService;
use App\Services\Service\ServiceStatsService;
use App\Services\User\UserStatsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display dashboard page based on authenticated user role.
     */
    public function index(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Old Dashboard Logic
        |--------------------------------------------------------------------------
        |
        | Kode lama dashboard masih disimpan di sini, tetapi dinonaktifkan karena
        | dashboard sekarang akan dirender berdasarkan role user.
        |
        */

        /*
        $filterOrder = OrderFilterDTO::fromRequestDashboard();
        $orders = OrderQueryService::getOrdersData($filterOrder, null);

        $todayOrderCount = OrderStatsService::getTodayOrderCount();
        $processOrderCount = OrderStatsService::getProcessOrderCount();
        $doneOrderCount = OrderStatsService::getDoneOrderCount();
        $todayRevenue = OrderStatsService::getTodayRevenue();

        $chartWeekRevenue = OrderStatsService::getChartWeekRevenue();
        $chartMonthStatuses = OrderStatsService::getChartMonthStatuses();

        $orderStatusOptions = OrderStatus::options();
        $orderTransitionRules = OrderStatus::allowedRoleTransitions();

        return Inertia::render('dashboard', [
            'orders' => $orders,
            'orderTransitionRules' => $orderTransitionRules,
            'orderStatusOptions' => $orderStatusOptions,

            'chartWeekRevenue' => $chartWeekRevenue,
            'chartMonthStatuses' => $chartMonthStatuses,

            'todayRevenue' => $todayRevenue,
            'todayOrderCount' => $todayOrderCount,
            'processOrderCount' => $processOrderCount,
            'doneOrderCount' => $doneOrderCount,
        ]);
        */

        $user = $request->user();

        return match ($user->role) {
            UserRole::SUPER_ADMIN => $this->renderSuperAdminDashboard($request),
            UserRole::ADMIN => $this->renderAdminDashboard($request),
            UserRole::CASHIER => $this->renderCashierDashboard($request),
            UserRole::OPERATOR => $this->renderOperatorDashboard($request),
            default => abort(403),
        };
    }

    /**
     * Render Super Admin dashboard.
     */
    private function renderSuperAdminDashboard(Request $request)
    {
        return Inertia::render('dashboard', [
            'dashboardRole' => UserRole::SUPER_ADMIN->value,
            'stats' => [
                'processingOrdersAllOutlets' => OrderStatsService::getProcessOrderCount(),
                'readyOrdersAllOutlets' => OrderStatsService::getDoneOrderCount(),
                'almostOverdueOrdersAllOutlets' => OrderStatsService::getAlmostOverdueCount(),
                'overdueOrdersAllOutlets' => OrderStatsService::getOverdueCount(),
                'todayRevenueAllOutlets' => OrderStatsService::getTodayRevenue(),
                'thisMonthRevenueAllOutlets' => OrderStatsService::getThisMonthRevenue(),
                'todayOrdersAllOutlets' => OrderStatsService::getTodayOrderCount(),
                'thisMonthOrdersAllOutlets' => OrderStatsService::getThisMonthOrderCount(),
                'cancelledTodayAllOutlets' => OrderStatsService::getCancelledTodayCount(),
                'cancelledThisMonthAllOutlets' => OrderStatsService::getCancelledThisMonthCount(),
                'activeOutlets' => OutletStatsService::getActiveOutletCount(),
                'activeUsers' => UserStatsService::getActiveUserCount(),
            ],
            'chartMonthRevenueTrend' => OrderStatsService::getChartMonthRevenueTrend(),
            'chartMonthOrderStatuses' => OrderStatsService::getChartMonthOrderStatuses(),
        ]);
    }

    /**
     * Render Admin dashboard.
     */
    private function renderAdminDashboard(Request $request)
    {
        $user = $request->user();
        $outletId = $user->outlet_id ?? 0;

        return Inertia::render('dashboard', [
            'dashboardRole' => UserRole::ADMIN->value,
            'stats' => [
                'pendingOrders' => OrderStatsService::getPendingOrderCountForOutlet($outletId),
                'processOrders' => OrderStatsService::getProcessOrderCountForOutlet($outletId),
                'readyOrders' => OrderStatsService::getDoneOrderCountForOutlet($outletId),
                'almostOverdueOrders' => OrderStatsService::getAlmostOverdueCountForOutlet($outletId),
                'overdueOrders' => OrderStatsService::getOverdueCountForOutlet($outletId),
                'todayRevenue' => OrderStatsService::getTodayRevenueForOutlet($outletId),
                'todayOrders' => OrderStatsService::getTodayOrderCountForOutlet($outletId),
                'completedToday' => OrderStatsService::getCompletedTodayCountForOutlet($outletId),
                'pickedUpToday' => OrderStatsService::getPickedUpTodayCountForOutlet($outletId),
                'cancelledToday' => OrderStatsService::getCancelledTodayCountForOutlet($outletId),
                'employeeCount' => UserStatsService::getEmployeeCountForOutlet($outletId),
                'monthRevenue' => OrderStatsService::getThisMonthRevenueForOutlet($outletId),
            ],
            'chartRevenueTrend' => OrderStatsService::getChartMonthRevenueTrendForOutlet($outletId),
            'chartOrderMovement' => OrderStatsService::getChartMonthOrderMovementForOutlet($outletId),
        ]);
    }

    /**
     * Render Cashier dashboard.
     */
    private function renderCashierDashboard(Request $request)
    {
        $user = $request->user();
        $outletId = $user->outlet_id ?? 0;

        return Inertia::render('dashboard', [
            'dashboardRole' => UserRole::CASHIER->value,
            'stats' => [
                'pendingOrders' => OrderStatsService::getPendingOrderCountForOutlet($outletId),
                'processOrders' => OrderStatsService::getProcessOrderCountForOutlet($outletId),
                'readyOrders' => OrderStatsService::getDoneOrderCountForOutlet($outletId),
                'overdueOrders' => OrderStatsService::getOverdueCountForOutlet($outletId),
                'todayRevenue' => OrderStatsService::getTodayRevenueForOutlet($outletId),
                'cashRevenue' => OrderStatsService::getTodayRevenueByPaymentMethodForOutlet($outletId, PaymentMethod::CASH),
                'qrisRevenue' => OrderStatsService::getTodayRevenueByPaymentMethodForOutlet($outletId, PaymentMethod::QRIS),
                'todayOrders' => OrderStatsService::getTodayOrderCountForOutlet($outletId),
                'completedToday' => OrderStatsService::getCompletedTodayCountForOutlet($outletId),
                'cancelledToday' => OrderStatsService::getCancelledTodayCountForOutlet($outletId),
                'activeServices' => ServiceStatsService::getActiveServiceCountForOutlet($outletId),
            ],
            'chartTodayHourlyOrders' => OrderStatsService::getTodayHourlyOrderCountForOutlet($outletId),
            'chartTodayPaymentMethods' => OrderStatsService::getTodayPaymentMethodChartDataForOutlet($outletId),
        ]);
    }

    /**
     * Render Operator dashboard.
     */
    private function renderOperatorDashboard(Request $request)
    {
        $user = $request->user();
        $outletId = $user->outlet_id ?? 0;

        return Inertia::render('dashboard', [
            'dashboardRole' => UserRole::OPERATOR->value,
            'stats' => [
                'pendingOrders' => OrderStatsService::getPendingOrderCountForOutlet($outletId),
                'processOrders' => OrderStatsService::getProcessOrderCountForOutlet($outletId),
                'almostOverdueOrders' => OrderStatsService::getAlmostOverdueCountForOutlet($outletId),
                'overdueOrders' => OrderStatsService::getOverdueCountForOutlet($outletId),
                'completedToday' => OrderStatsService::getCompletedTodayCountForOutlet($outletId),
                'readyOrders' => OrderStatsService::getDoneOrderCountForOutlet($outletId),
                'pickedUpToday' => OrderStatsService::getPickedUpTodayCountForOutlet($outletId),
            ],
            'chartTodayHourlyProcessedVsCompleted' => OrderStatsService::getTodayHourlyProcessedVsCompletedForOutlet($outletId),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
