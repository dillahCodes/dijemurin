<?php

namespace App\Services\Accident;

use App\DTOs\Accident\AccidentFilterDTO;
use App\Enums\User\UserRole;
use App\Http\Resources\Accident\AccidentDetailResource;
use App\Http\Resources\Accident\AccidentResource;
use App\Models\Accident\Accident;

class AccidentQueryService
{
    public static function getAccidentsData(AccidentFilterDTO $filter)
    {
        $user = auth()->user();
        $isSuperAdmin = $user->hasAnyRole([UserRole::SUPER_ADMIN]);

        $query = Accident::with(['outlet', 'order', 'reporter', 'resolver'])
            ->withCount('items')
            ->withSum('items', 'compensation_amount')
            ->filterType($filter->type)
            ->filterStatus($filter->status)
            ->filterDateRange($filter->startDate, $filter->endDate, $filter->dateType)
            ->forReporter($filter->reporterId)
            ->search($filter->search);

        if ($isSuperAdmin) {
            $query->forOutlet($filter->outletIdSelected);
        } else {
            $query->forOutlet($user->outlet_id);
        }

        $accidents = $query->latest()
            ->paginate($filter->limit)
            ->withQueryString();

        return AccidentResource::collection($accidents);
    }

    /**
     * Get Accident detail
     */
    public static function getAccidentDetail(Accident $accident): AccidentDetailResource
    {
        $accident->load(['outlet', 'reporter', 'resolver', 'order', 'items.orderItem', 'logs.user', 'logs.accidentItem.orderItem']);

        return new AccidentDetailResource($accident);
    }
}
