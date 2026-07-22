<?php

namespace App\Http\Resources\Report;

use App\DTOs\Report\ReportFilterDTO;
use App\Enums\User\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    private ?string $startDate;

    private ?string $endDate;

    public function __construct($resource, ReportFilterDTO $filter)
    {
        parent::__construct($resource);
        $this->startDate = $filter->startDate;
        $this->endDate = $filter->endDate;
    }

    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isStaff = $user?->hasAnyRole([UserRole::CASHIER, UserRole::OPERATOR]) ?? false;

        return [
            'period' => [
                'start_date' => $this->startDate,
                'end_date' => $this->endDate,
            ],

            'top_level' => $isStaff ? null : ReportOrderTopLevelResource::make($this->resource),
            'middle_level' => $isStaff ? null : ReportOrderMiddleLevelResource::make($this->resource),
            'first_level' => ReportOrderFirstLevelResource::make($this->resource),
        ];
    }
}
