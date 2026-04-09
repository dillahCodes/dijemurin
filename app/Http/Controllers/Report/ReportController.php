<?php

namespace App\Http\Controllers\Report;

use App\DTOs\Report\ReportFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Resources\Report\ReportResource;
use App\Services\Report\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterReport = ReportFilterDTO::fromRequest($request);
        $reportsData = ReportService::getReportsData($filterReport);
        $reports = ReportResource::make($reportsData, $filterReport);

        $filters = $filterReport->toArray();

        return Inertia::render('laporan/laporan', [
            'filters' => $filters,
            'reports' => $reports,
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
