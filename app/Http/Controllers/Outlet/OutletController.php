<?php

namespace App\Http\Controllers\Outlet;

use App\DTOs\Outlet\OutletFilterDTO;
use App\Enums\Outlet\OutletStatus;
use App\Http\Controllers\Controller;
use App\Models\Outlet\Outlet;
use App\Services\Outlet\OutletService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OutletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterOutlet = OutletFilterDTO::fromRequest($request);
        $outlets = OutletService::getOutletsData($filterOutlet);
        $filters = $filterOutlet->toArray();

        $outletStatusOptions = OutletStatus::options();

        return Inertia::render('outlet/outlet', [
            'outlets' => $outlets,
            'filters' => $filters,
            'outletStatusOptions' => $outletStatusOptions,
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
    public function show(Outlet $outlet)
    {
        $outletDetail = OutletService::getOutletDetailData($outlet->id);

        return Inertia::render('outlet/outlet-detail', [
            'outletDetail' => $outletDetail,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Outlet $outlet)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Outlet $outlet)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Outlet $outlet)
    {
        //
    }
}
