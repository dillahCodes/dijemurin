<?php

namespace App\DTOs\Order;

use App\Enums\Order\OrderDateType;
use App\Enums\Order\OrderStatus;
use App\Enums\Order\OrderTimeStatus;
use App\Enums\Payment\PaymentMethod;
use Illuminate\Http\Request;

class OrderFilterDTO
{
    private const DEFAULT_LIMIT = 10;

    private const MAX_LIMIT = 100;

    public function __construct(
        public readonly ?string $search,
        public readonly string|array|null $status,
        public readonly ?PaymentMethod $paymentMethod,
        public readonly ?string $startDate,
        public readonly ?string $endDate,
        public readonly ?OrderTimeStatus $timeStatus,
        public readonly OrderDateType $dateType,
        public readonly int $limit,
    ) {}

    /**
     * Parse status query input into clean string or array.
     */
    private static function parseStatus(mixed $statusInput): string|array|null
    {
        if (is_array($statusInput)) {
            // Trim whitespace for each item and filter out non-strings
            $trimmedItems = array_map(function ($statusItem) {
                return is_string($statusItem) ? trim($statusItem) : null;
            }, $statusInput);

            // Filter out null or empty string values
            $nonEmptyItems = array_filter($trimmedItems, function ($statusItem) {
                return $statusItem !== null && $statusItem !== '';
            });

            // Re-index the array keys to ensure sequential numeric keys
            return array_values($nonEmptyItems);
        }

        if (! is_string($statusInput)) {
            return null;
        }

        $trimmed = trim($statusInput);

        if (str_contains($trimmed, ',')) {
            // Split comma-separated values into an array
            $splitItems = explode(',', $trimmed);

            // Trim whitespace for each status item
            $trimmedItems = array_map('trim', $splitItems);

            // Filter out empty values
            $nonEmptyItems = array_filter($trimmedItems, function ($statusItem) {
                return $statusItem !== '';
            });

            // Re-index the array keys to ensure sequential numeric keys
            return array_values($nonEmptyItems);
        }

        return $trimmed !== '' ? $trimmed : null;
    }

    /**
     * Base factory (SAFE: no user limit)
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->query('search'),
            self::parseStatus($request->query('status')),
            PaymentMethod::tryFrom($request->query('paymentMethod', '')),
            $request->query('startDate'),
            $request->query('endDate'),
            OrderTimeStatus::tryFrom($request->query('timeStatus', '')),
            OrderDateType::tryFrom($request->query('dateType', '')) ?? OrderDateType::ORDER_CREATED,
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
            self::parseStatus($request->query('status')),
            PaymentMethod::tryFrom($request->query('paymentMethod', '')),
            $request->query('startDate'),
            $request->query('endDate'),
            OrderTimeStatus::tryFrom($request->query('timeStatus', '')),
            OrderDateType::tryFrom($request->query('dateType', '')) ?? OrderDateType::ORDER_CREATED,
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
            timeStatus: null,
            dateType: OrderDateType::ORDER_CREATED,
            limit: $limit
        );
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
            $this->timeStatus,
            $this->dateType,
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
            'status' => $this->resolveStatusValue(),
            'paymentMethod' => $this->paymentMethod?->value,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
            'timeStatus' => $this->timeStatus?->value,
            'dateType' => $this->dateType !== OrderDateType::ORDER_CREATED ? $this->dateType->value : null,
        ], fn ($value) => $value !== null);
    }

    /**
     * Resolve status value to its primitive representation.
     */
    private function resolveStatusValue(): mixed
    {
        if ($this->status instanceof OrderStatus) {
            return $this->status->value;
        }

        if (is_array($this->status)) {
            // Convert any OrderStatus enum instances in the status array to their raw values
            $rawStatusValues = array_map(function ($statusItem) {
                return $statusItem instanceof OrderStatus ? $statusItem->value : $statusItem;
            }, $this->status);

            return $rawStatusValues;
        }

        return $this->status;
    }
}
