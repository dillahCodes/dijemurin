<?php

namespace App\DTOs\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use Illuminate\Http\Request;

class OrderFilterDTO
{
    private const DEFAULT_LIMIT = 10;

    private const MAX_LIMIT = 100;

    public function __construct(
        public readonly ?string $search,
        public readonly ?OrderStatus $status,
        public readonly ?PaymentMethod $paymentMethod,
        public readonly ?string $startDate,
        public readonly ?string $endDate,
        public readonly int $limit,
    ) {}

    /**
     * Base factory (SAFE: no user limit)
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('search'),
            OrderStatus::tryFrom($request->query('status', '')),
            PaymentMethod::tryFrom($request->query('payment_method', '')),
            $request->query('start_date'),
            $request->query('end_date'),
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
            OrderStatus::tryFrom($request->query('status', '')),
            PaymentMethod::tryFrom($request->query('payment_method', '')),
            $request->query('start_date'),
            $request->query('end_date'),
            self::sanitizeLimit($limit)
        );
    }

    /**
     * For dashboard
     */
    public static function fromRequestDashboard(int $limit = 5): self
    {
        return new self(
            search: null,
            status: null,
            paymentMethod: null,
            startDate: null,
            endDate: null,
            limit: $limit
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
            $this->paymentMethod,
            $this->startDate,
            $this->endDate,
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
            'payment_method' => $this->paymentMethod?->value,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
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
