<?php

namespace App\Http\Controllers\Accident;

use App\DTOs\Accident\AccidentFilterDTO;
use App\DTOs\Order\OrderComboboxFilterDTO;
use App\DTOs\Outlet\OutletComboboxFilterDTO;
use App\Enums\Accident\AccidentCompensationType;
use App\Enums\Accident\AccidentDateType;
use App\Enums\Accident\AccidentStatus;
use App\Enums\Accident\AccidentType;
use App\Enums\User\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accident\AccidentStoreRequest;
use App\Http\Requests\Accident\AccidentUpdateRequest;
use App\Models\Accident\Accident;
use App\Services\Accident\AccidentQueryService;
use App\Services\Accident\AccidentService;
use App\Services\Order\OrderQueryService;
use App\Services\Outlet\OutletQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = AccidentFilterDTO::fromRequest($request);
        $filterOutlet = OutletComboboxFilterDTO::fromRequest($request);
        $filters = [...$filter->toArray(), ...$filterOutlet->toArray()];

        $accidents = AccidentQueryService::getAccidentsData($filter);
        $outlets = OutletQueryService::getOutletsComboboxData($filterOutlet);
        $outletSelected = OutletQueryService::getOutletComboboxSelectedData($filterOutlet);

        return Inertia::render('accident/index', [
            'accidents' => $accidents,
            'filters' => $filters,
            'accidentStatusOptions' => AccidentStatus::options(),
            'accidentTypeOptions' => AccidentType::options(),
            'compensationTypeOptions' => AccidentCompensationType::options(),
            'accidentDateTypeOptions' => AccidentDateType::options(),
            'outlets' => $outlets,
            'outletSelected' => $outletSelected,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $filterOutlet = OutletComboboxFilterDTO::fromRequest($request);
        $filterOrder = OrderComboboxFilterDTO::fromRequest($request);

        $outlets = OutletQueryService::getOutletsComboboxData($filterOutlet);
        $outletSelected = OutletQueryService::getOutletComboboxSelectedData($filterOutlet);
        $orders = OrderQueryService::getOrdersComboboxData($filterOrder);
        $orderItems = OrderQueryService::getOrderItemsComboboxData($filterOrder);

        return Inertia::render('accident/tambah', [
            'outlets' => $outlets,
            'outletSelected' => $outletSelected,
            'orders' => $orders,
            'orderItems' => $orderItems,
            'accidentTypeOptions' => AccidentType::options(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AccidentStoreRequest $request)
    {
        $data = $request->validated();
        AccidentService::createAccident($data);

        return redirect()->back()->with(['success' => 'Insiden berhasil dilaporkan']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Accident $accident)
    {
        $hasSuperAdmin = auth()->user()->hasAnyRole([UserRole::SUPER_ADMIN]);
        $user = auth()->user();

        if (! $hasSuperAdmin && $user->outlet_id != $accident->outlet_id) {
            abort(403);
        }

        $accidentDetail = AccidentQueryService::getAccidentDetail($accident);

        return Inertia::render('accident/detail', [
            'accident' => $accidentDetail,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Accident $accident)
    {
        $hasSuperAdmin = auth()->user()->hasAnyRole([UserRole::SUPER_ADMIN]);
        $user = auth()->user();

        if (! $hasSuperAdmin && $user->outlet_id != $accident->outlet_id) {
            abort(403);
        }

        $accidentDetail = AccidentQueryService::getAccidentDetail($accident);

        return Inertia::render('accident/edit', [
            'accident' => $accidentDetail,
            'accidentTypeOptions' => AccidentType::options(),
            'accidentStatusOptions' => AccidentStatus::options(),
            'compensationTypeOptions' => AccidentCompensationType::options(),
            'accidentTransitionRules' => AccidentStatus::allowedRoleTransitions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AccidentUpdateRequest $request, Accident $accident)
    {
        $data = $request->validated();
        AccidentService::updateAccident($data, $accident);

        return redirect()->back()->with(['success' => 'Data insiden berhasil diperbarui']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Accident $accident)
    {
        // $accident->delete();
        // return redirect()->back()->with(['success' => 'Data insiden berhasil dihapus']);
    }
}
