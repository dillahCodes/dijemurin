<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\Payment\PaymentMethod;
use App\Enums\User\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\Dashboard\DashboardRevenueTrendResource;
use App\Services\Accident\AccidentStatsService;
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
        $thisMonthRevenue = OrderStatsService::getThisMonthRevenue();
        $resolvedLoss = AccidentStatsService::getResolvedThisMonthLoss();

        $revenueTrend = OrderStatsService::getChartMonthRevenueTrend();
        $lossTrend = AccidentStatsService::getChartMonthLossTrend();
        $chartMonthRevenueTrend = new DashboardRevenueTrendResource($revenueTrend, $lossTrend);

        return Inertia::render('dashboard', [
            'dashboardRole' => UserRole::SUPER_ADMIN->value,
            'stats' => [
                'processingOrdersAllOutlets' => OrderStatsService::getProcessOrderCount(),
                'readyOrdersAllOutlets' => OrderStatsService::getDoneOrderCount(),
                'almostOverdueOrdersAllOutlets' => OrderStatsService::getAlmostOverdueCount(),
                'overdueOrdersAllOutlets' => OrderStatsService::getOverdueCount(),
                'todayRevenueAllOutlets' => OrderStatsService::getTodayRevenue(),
                'thisMonthRevenueAllOutlets' => $thisMonthRevenue,
                'thisMonthNetRevenueAllOutlets' => $thisMonthRevenue - $resolvedLoss,
                'todayOrdersAllOutlets' => OrderStatsService::getTodayOrderCount(),
                'thisMonthOrdersAllOutlets' => OrderStatsService::getThisMonthOrderCount(),
                'cancelledTodayAllOutlets' => OrderStatsService::getCancelledTodayCount(),
                'cancelledThisMonthAllOutlets' => OrderStatsService::getCancelledThisMonthCount(),
                'activeOutlets' => OutletStatsService::getActiveOutletCount(),
                'activeUsers' => UserStatsService::getActiveUserCount(),
                'activeAccidentsAllOutlets' => AccidentStatsService::getActiveAccidentCount(),
                'resolvedAccidentsThisMonthAllOutlets' => AccidentStatsService::getResolvedThisMonthCount(),
                'resolvedAccidentLossThisMonthAllOutlets' => $resolvedLoss,
            ],
            'chartMonthRevenueTrend' => $chartMonthRevenueTrend->toArray(),
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

        $monthRevenue = OrderStatsService::getThisMonthRevenueForOutlet($outletId);
        $resolvedLoss = AccidentStatsService::getResolvedThisMonthLoss($outletId);

        $revenueTrend = OrderStatsService::getChartMonthRevenueTrendForOutlet($outletId);
        $lossTrend = AccidentStatsService::getChartMonthLossTrend($outletId);

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
                'monthRevenue' => $monthRevenue,
                'netRevenue' => $monthRevenue - $resolvedLoss,
                'activeAccidents' => AccidentStatsService::getActiveAccidentCount($outletId),
                'resolvedAccidentsThisMonth' => AccidentStatsService::getResolvedThisMonthCount($outletId),
                'resolvedAccidentLossThisMonth' => $resolvedLoss,
            ],
            'chartRevenueTrend' => (new DashboardRevenueTrendResource($revenueTrend, $lossTrend))->toArray(),
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
                'activeAccidents' => AccidentStatsService::getActiveAccidentCount($outletId),
                'myReportedAccidents' => AccidentStatsService::getReportedAccidentCount($user->id),
                'resolvedAccidentsThisMonth' => AccidentStatsService::getResolvedThisMonthCount($outletId),
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
                'activeAccidents' => AccidentStatsService::getActiveAccidentCount($outletId),
                'myReportedAccidents' => AccidentStatsService::getReportedAccidentCount($user->id),
                'resolvedAccidentsThisMonth' => AccidentStatsService::getResolvedThisMonthCount($outletId),
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
