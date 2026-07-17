<?php

namespace App\DTOs\Order;

use Illuminate\Http\Request;

class OrderComboboxFilterDTO
{
    private const DEFAULT_LIMIT = 10;

    private const MAX_LIMIT = 100;

    public function __construct(
        public readonly ?int $outletId,
        public readonly ?int $orderIdSelected,
        public readonly ?string $orderSearch,
        public readonly int $limit,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            outletId: $request->query('outletIdSelected') ? (int) $request->query('outletIdSelected') : null,
            orderIdSelected: $request->query('order_id') ? (int) $request->query('order_id') : null,
            orderSearch: $request->query('orderSearch'),
            limit: self::DEFAULT_LIMIT,
        );
    }

    /**
     * Optional: allow limit from request (controlled)
     */
    public static function fromRequestWithLimit(Request $request): self
    {
        $limit = (int) $request->query('limit', self::DEFAULT_LIMIT);

        return new self(
            outletId: $request->query('outletIdSelected') ? (int) $request->query('outletIdSelected') : null,
            orderIdSelected: $request->query('order_id') ? (int) $request->query('order_id') : null,
            orderSearch: $request->query('orderSearch'),
            limit: self::sanitizeLimit($limit),
        );
    }

    /**
     * Backend override
     */
    public function withLimit(int $limit): self
    {
        return new self(
            outletId: $this->outletId,
            orderIdSelected: $this->orderIdSelected,
            orderSearch: $this->orderSearch,
            limit: self::sanitizeLimit($limit),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'outletIdSelected' => $this->outletId,
            'order_id' => $this->orderIdSelected,
            'orderSearch' => $this->orderSearch,
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
