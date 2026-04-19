<?php

namespace App\DTOs\Outlet;

use App\Enums\Outlet\OutletStatus;
use Illuminate\Http\Request;

class OutletFilterDTO
{
    private const DEFAULT_LIMIT = 10;

    private const MAX_LIMIT = 100;

    public function __construct(
        public readonly ?string $search,
        public readonly ?OutletStatus $status,
        public readonly int $limit,
    ) {}

    /**
     * Base factory (SAFE: no user limit)
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('search'),
            OutletStatus::tryFrom($request->query('status', '')),
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
            $request->query('search'),
            OutletStatus::tryFrom($request->query('status', '')),
            self::sanitizeLimit($limit)
        );
    }

    /**
     * Backend override
     */
    public function withLimit(int $limit): self
    {
        return new self(
            $this->search,
            $this->status,
            self::sanitizeLimit($limit)
        );
    }

    /**
     * Convert to frontend filters (only non-null values)
     */
    public function toArray(): array
    {
        return array_filter([
            'search' => $this->search,
            'status' => $this->status?->value,
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
