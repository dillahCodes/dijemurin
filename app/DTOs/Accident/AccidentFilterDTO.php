<?php

namespace App\DTOs\Accident;

use App\Enums\Accident\AccidentDateType;
use Illuminate\Http\Request;

class AccidentFilterDTO
{
    private const DEFAULT_LIMIT = 10;

    private const MAX_LIMIT = 100;

    public function __construct(
        public readonly ?string $search,
        public readonly string|array|null $status,
        public readonly string|array|null $type,
        public readonly ?string $startDate,
        public readonly ?string $endDate,
        public readonly AccidentDateType $dateType,
        public readonly ?int $outletIdSelected,
        public readonly ?string $outletSearch,
        public readonly ?int $reporterId,
        public readonly int $limit,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('search'),
            self::parseArrayInput($request->query('status')),
            self::parseArrayInput($request->query('type')),
            $request->query('startDate'),
            $request->query('endDate'),
            AccidentDateType::tryFrom($request->query('dateType', '')) ?? AccidentDateType::ACCIDENT_CREATED,
            $request->query('outletIdSelected') ? (int) $request->query('outletIdSelected') : null,
            $request->query('outletSearch'),
            $request->query('reporterId') ? (int) $request->query('reporterId') : null,
            self::DEFAULT_LIMIT
        );
    }

    public static function fromRequestWithLimit(Request $request): self
    {
        $limit = (int) $request->query('limit', self::DEFAULT_LIMIT);

        return new self(
            $request->query('search'),
            self::parseArrayInput($request->query('status')),
            self::parseArrayInput($request->query('type')),
            $request->query('startDate'),
            $request->query('endDate'),
            AccidentDateType::tryFrom($request->query('dateType', '')) ?? AccidentDateType::ACCIDENT_CREATED,
            $request->query('outletIdSelected') ? (int) $request->query('outletIdSelected') : null,
            $request->query('outletSearch'),
            $request->query('reporterId') ? (int) $request->query('reporterId') : null,
            self::sanitizeLimit($limit)
        );
    }

    private static function sanitizeLimit(int $limit): int
    {
        if ($limit < 1) {
            return self::DEFAULT_LIMIT;
        }

        return min($limit, self::MAX_LIMIT);
    }

    private static function parseArrayInput(mixed $input): string|array|null
    {
        if (is_array($input)) {
            $trimmedItems = array_map(function ($item) {
                return is_string($item) ? trim($item) : null;
            }, $input);

            $nonEmptyItems = array_filter($trimmedItems, function ($item) {
                return $item !== null && $item !== '';
            });

            return array_values($nonEmptyItems);
        }

        if (! is_string($input)) {
            return null;
        }

        $trimmed = trim($input);

        if (str_contains($trimmed, ',')) {
            $splitItems = explode(',', $trimmed);
            $trimmedItems = array_map('trim', $splitItems);
            $nonEmptyItems = array_filter($trimmedItems, function ($item) {
                return $item !== '';
            });

            return array_values($nonEmptyItems);
        }

        return $trimmed !== '' ? $trimmed : null;
    }

    public function toArray(): array
    {
        return array_filter([
            'search' => $this->search,
            'status' => $this->status,
            'type' => $this->type,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
            'dateType' => $this->dateType !== AccidentDateType::ACCIDENT_CREATED ? $this->dateType->value : null,
            'outletIdSelected' => $this->outletIdSelected,
            'outletSearch' => $this->outletSearch,
            'reporterId' => $this->reporterId,
        ], fn ($value) => $value !== null);
    }
}
