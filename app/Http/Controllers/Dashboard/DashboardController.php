<?php

namespace App\Http\Controllers\Dashboard;

use App\DTOs\Order\OrderFilterDTO;
use App\Enums\Order\OrderStatus;
use App\Http\Controllers\Controller;
use App\Services\Order\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $filterOrder = OrderFilterDTO::fromRequestDashboard();
        $orders = OrderService::getOrdersData($filterOrder);

        $todayOrderCount = OrderService::getTodayOrderCount();
        $processOrderCount = OrderService::getProcessOrderCount();
        $doneOrderCount = OrderService::getDoneOrderCount();
        $todayRevenue = OrderService::getTodayRevenue();

        $chartWeekRevenue = OrderService::getChartWeekRevenue();
        $chartMonthStatuses = OrderService::getChartMonthStatuses();

        $orderStatusOptions = OrderStatus::options();
        $orderTransitionRules = OrderStatus::allowedTransitions();

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
