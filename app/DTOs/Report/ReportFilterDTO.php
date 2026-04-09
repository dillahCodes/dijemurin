<?php

namespace App\DTOs\Report;

use Illuminate\Http\Request;

class ReportFilterDTO
{
    public function __construct(
        public readonly ?string $startDate,
        public readonly ?string $endDate,
    ) {}

    /**
     * Base factory
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('start_date'),
            $request->query('end_date'),
        );
    }

    public function hasDateRange(): bool
    {
        return $this->startDate !== null && $this->endDate !== null;
    }

    /**
     * Convert to frontend filters (only non-null values)
     */
    public function toArray(): array
    {
        return array_filter([
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
        ], fn ($value) => $value !== null);
    }
}
