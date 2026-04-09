<?php

namespace App\Http\Resources\Report;

use App\DTOs\Report\ReportFilterDTO;
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
        return [
            'period' => [
                'start_date' => $this->startDate,
                'end_date' => $this->endDate,
            ],

            'top_level' => ReportOrderTopLevelResource::make($this->resource),
            'middle_level' => ReportOrderMiddleLevelResource::make($this->resource),
            'first_level' => ReportOrderFirstLevelResource::make($this->resource),
        ];
    }
}
