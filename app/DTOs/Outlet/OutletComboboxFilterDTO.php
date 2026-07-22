<?php

namespace App\DTOs\Outlet;

use Illuminate\Http\Request;

class OutletComboboxFilterDTO
{
    private const DEFAULT_LIMIT = 10;

    private const MAX_LIMIT = 100;

    public function __construct(
        public readonly ?string $outletSearch,
        public readonly ?int $outletIdSelected,
        public readonly int $limit,
    ) {}

    /**
     * Base factory (SAFE: no user limit)
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('outletSearch'),
            $request->query('outletIdSelected'),
            self::DEFAULT_LIMIT
        );
    }

    /**
     * Optional: allow limit from request (controlled)
     */
    public static function fromRequestWithLimit(Request $request): self
    {
        $limit = (int) $request->query('limit', self::DEFAULT_LIMIT);

        return new self(
            $request->query('outletSearch'),
            $request->query('outletIdSelected'),
            self::sanitizeLimit($limit)
        );
    }

    /**
     * Backend override
     */
    public function withLimit(int $limit): self
    {
        return new self(
            $this->outletSearch,
            $this->outletIdSelected,
            self::sanitizeLimit($limit)
        );
    }

    /**
     * Convert to frontend filters (only non-null values)
     */
    public function toArray(): array
    {
        return array_filter([
            'outletSearch' => $this->outletSearch,
            'outletIdSelected' => $this->outletIdSelected,
        ], fn ($value) => $value !== null);
    }

    /**
     * Centralized limit protection
     */
    private static function sanitizeLimit(int $limit): int
    {
        if ($limit < 1) {
            return self::DEFAULT_LIMIT;
        }

        return min($limit, self::MAX_LIMIT);
    }
}
